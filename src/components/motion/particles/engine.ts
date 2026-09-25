import { mulberry } from "./shapes";
import type { Engine, Rect, Scene, ShapeOut, Tier } from "./types";

/**
 * The particle field: grains, seeds and peppercorns that morph between
 * shapes. Each particle holds a `from` and a `to` state; the GPU interpolates
 * between them, so a morph costs almost nothing on the CPU. When a scene
 * settles with `handoff`, particles fade out and the loop stops.
 */

const MAX_PARTS = 16;
const DELAY_SPREAD = 0.35;

const COUNTS: Record<Exclude<Tier, "off">, number> = { high: 2200, mid: 900, low: 260 };
const DPR_CAP: Record<Exclude<Tier, "off">, number> = { high: 2, mid: 1.5, low: 1 };

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const easeSettle = (t: number) => 1 - Math.pow(1 - t, 3);

const VERT = `#version 300 es
precision highp float;
in vec4 aFrom;   // x, y, alpha, size
in vec4 aTo;
in vec3 aFromCol;
in vec3 aToCol;
in vec4 aSeed;
in float aPart;
uniform vec2 uRes;
uniform float uDpr;
uniform float uT;
uniform float uScatter;
uniform float uTime;
uniform float uJitter;
uniform float uAlpha;
uniform vec4 uTint;
uniform vec2 uOff[${MAX_PARTS}];
uniform float uBloom;
out vec3 vCol;
out float vAlpha;
out float vKind;
out float vRot;
void main() {
  float delay = aSeed.z * ${DELAY_SPREAD.toFixed(2)};
  float t = clamp((uT - delay) / ${(1 - DELAY_SPREAD).toFixed(2)}, 0.0, 1.0);
  float e = 1.0 - pow(1.0 - t, 3.0);
  vec2 b = aTo.xy + uOff[int(aPart)];
  // A bloom starts from inside its own section, so it scrolls with it.
  vec2 a = aFrom.xy + uOff[int(aPart)] * uBloom;
  vec2 p = mix(a, b, e);
  float arc = sin(3.14159265 * t);
  float ang = aSeed.x * 6.2831853;
  p += vec2(cos(ang), sin(ang)) * arc * uScatter * (0.35 + aSeed.y);
  p.y -= arc * uScatter * 0.6 * aSeed.w;
  p += vec2(sin(uTime * 0.0007 + aSeed.x * 40.0), cos(uTime * 0.0006 + aSeed.y * 40.0)) * uJitter * (0.4 + aSeed.w);
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(1.0, mix(aFrom.w, aTo.w, e) * uDpr);
  vAlpha = mix(aFrom.z, aTo.z, e) * uAlpha;
  vec3 c = mix(aFromCol, aToCol, e);
  vCol = mix(c, uTint.rgb, uTint.a * (0.55 + 0.45 * aSeed.y));
  vKind = floor(aSeed.w * 2.999);
  vRot = aSeed.x * 6.2831853;
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 vCol;
in float vAlpha;
in float vKind;
in float vRot;
out vec4 o;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float cs = cos(vRot), sn = sin(vRot);
  c = mat2(cs, -sn, sn, cs) * c;
  float d;
  if (vKind < 0.5) d = length(c);                                   // round seed
  else if (vKind < 1.5) d = length(c * vec2(1.0, 1.9));             // grain
  else d = length(c) + 0.07 * sin(atan(c.y, c.x) * 7.0);            // peppercorn
  float a = smoothstep(1.0, 0.72, d) * vAlpha;
  float light = 0.82 + 0.34 * clamp(1.0 - length(c - vec2(-0.4, -0.45)), 0.0, 1.0);
  o = vec4(vCol * light * a, a);
}`;

type Part = { anchor: Element | null; sample: Rect };

export function createEngine(canvas: HTMLCanvasElement, tier: Exclude<Tier, "off">): Engine {
  const gl =
    tier === "low"
      ? null
      : canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false, alpha: true, powerPreference: "low-power" });
  const effectiveTier = gl ? tier : "low";
  const N = COUNTS[effectiveTier];
  const dprCap = DPR_CAP[effectiveTier];

  // CPU state (mirrors what the shader sees)
  const seed = new Float32Array(N * 4);
  const from = new Float32Array(N * 4);
  const to = new Float32Array(N * 4);
  const fromCol = new Float32Array(N * 3);
  const toCol = new Float32Array(N * 3);
  const partIdx = new Float32Array(N);
  const offsets = new Float32Array(MAX_PARTS * 2);
  const baseSize = new Float32Array(N);

  const rng = mulberry(20240924);
  for (let i = 0; i < N; i++) {
    seed[i * 4] = rng();
    seed[i * 4 + 1] = rng();
    seed[i * 4 + 2] = rng();
    seed[i * 4 + 3] = rng();
    baseSize[i] = 2.2 + seed[i * 4 + 3] * 3.4;
  }

  let W = 0;
  let H = 0;
  let dpr = 1;
  let parts: Part[] = [];
  let scene: Scene | null = null;
  let start = 0;
  let duration = 1100;
  let scatterPx = 0;
  let jitter = 0;
  let bloomOn = 0;
  let alphaMul = 1;
  let fadeStart = 0;
  let settled = true;
  let handedOff = false;
  let tint: [number, number, number, number] = [0, 0, 0, 0];
  let raf = 0;
  let destroyed = false;
  let lastOffsetsKey = "";
  let frameCount = 0;
  let frameTimeSum = 0;
  let lastFrame = 0;
  let drawCount = N;

  /* ---------------- WebGL setup ---------------- */

  let prog: WebGLProgram | null = null;
  const buffers: Record<string, WebGLBuffer | null> = {};
  const uni: Record<string, WebGLUniformLocation | null> = {};
  const ctx2d = gl ? null : canvas.getContext("2d");

  if (gl) {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const attr = (name: string, size: number, data: Float32Array, usage: number) => {
      const loc = gl.getAttribLocation(prog!, name);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
      buffers[name] = buf;
    };
    attr("aFrom", 4, from, gl.DYNAMIC_DRAW);
    attr("aTo", 4, to, gl.DYNAMIC_DRAW);
    attr("aFromCol", 3, fromCol, gl.DYNAMIC_DRAW);
    attr("aToCol", 3, toCol, gl.DYNAMIC_DRAW);
    attr("aSeed", 4, seed, gl.STATIC_DRAW);
    attr("aPart", 1, partIdx, gl.DYNAMIC_DRAW);
    for (const u of ["uRes", "uDpr", "uT", "uScatter", "uTime", "uJitter", "uAlpha", "uTint", "uOff", "uBloom"]) {
      uni[u] = gl.getUniformLocation(prog, u);
    }
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  }

  const upload = () => {
    if (!gl) return;
    const put = (name: string, data: Float32Array) => {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name]);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    };
    put("aFrom", from);
    put("aTo", to);
    put("aFromCol", fromCol);
    put("aToCol", toCol);
    put("aPart", partIdx);
  };

  /* ---------------- sizing ---------------- */

  const resize = () => {
    const w = window.innerWidth;
    // Use the large viewport so mobile URL-bar changes don't resample.
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight);
    const changed = Math.abs(w - W) > 1 || Math.abs(h - H) > 120;
    if (!changed && W) return false;
    W = w;
    H = h;
    dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.height = `${H}px`;
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    return true;
  };

  /* ---------------- evaluation ---------------- */

  const progress = (now: number) => (settled ? 1 : Math.min(1, (now - start) / duration));

  /** Current on-screen state of particle i (no jitter), mirroring the shader. */
  const evalParticle = (i: number, T: number, out: Float32Array, outCol: Float32Array) => {
    const delay = seed[i * 4 + 2] * DELAY_SPREAD;
    const t = Math.min(1, Math.max(0, (T - delay) / (1 - DELAY_SPREAD)));
    const e = easeSettle(t);
    const p = partIdx[i] | 0;
    const bx = to[i * 4] + offsets[p * 2];
    const by = to[i * 4 + 1] + offsets[p * 2 + 1];
    const arc = Math.sin(Math.PI * t);
    const ang = seed[i * 4] * Math.PI * 2;
    const ax = from[i * 4] + offsets[p * 2] * bloomOn;
    const ay = from[i * 4 + 1] + offsets[p * 2 + 1] * bloomOn;
    let x = ax + (bx - ax) * e;
    let y = ay + (by - ay) * e;
    x += Math.cos(ang) * arc * scatterPx * (0.35 + seed[i * 4 + 1]);
    y += Math.sin(ang) * arc * scatterPx * (0.35 + seed[i * 4 + 1]);
    y -= arc * scatterPx * 0.6 * seed[i * 4 + 3];
    out[0] = x;
    out[1] = y;
    out[2] = (from[i * 4 + 2] + (to[i * 4 + 2] - from[i * 4 + 2]) * e) * alphaMul;
    out[3] = from[i * 4 + 3] + (to[i * 4 + 3] - from[i * 4 + 3]) * e;
    for (let k = 0; k < 3; k++) outCol[k] = fromCol[i * 3 + k] + (toCol[i * 3 + k] - fromCol[i * 3 + k]) * e;
  };

  const rectOf = (el: Element | null | undefined): Rect => {
    if (el && el.isConnected) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) return { x: r.left, y: r.top, w: r.width, h: r.height };
    }
    return { x: 0, y: 0, w: W, h: H };
  };

  const updateOffsets = () => {
    let key = "";
    parts.forEach((p, i) => {
      if (!p.anchor || !p.anchor.isConnected) return;
      const r = p.anchor.getBoundingClientRect();
      offsets[i * 2] = r.left - p.sample.x;
      offsets[i * 2 + 1] = r.top - p.sample.y;
      key += `${offsets[i * 2] | 0},${offsets[i * 2 + 1] | 0};`;
    });
    const changed = key !== lastOffsetsKey;
    lastOffsetsKey = key;
    return changed;
  };

  /* ---------------- scenes ---------------- */

  const build = (s: Scene, instant: boolean) => {
    const now = performance.now();
    const T = progress(now);
    // Particles that handed off reappear exactly where the artwork was.
    if (handedOff) alphaMul = 1;
    const tmp = new Float32Array(4);
    const tmpCol = new Float32Array(3);

    // 1. Snapshot where everything is right now into `from`.
    if (!instant) {
      const snapFrom = new Float32Array(N * 4);
      const snapCol = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        evalParticle(i, T, tmp, tmpCol);
        snapFrom.set(tmp, i * 4);
        snapCol.set(tmpCol, i * 3);
      }
      from.set(snapFrom);
      fromCol.set(snapCol);
    }

    // 2. Optional spawn shape overrides the start positions.
    const r = mulberry(s.id.length * 7919 + 13);
    if (s.from && !instant) {
      const fr = rectOf(s.from.anchor);
      const out = s.from.shape(N, fr, r);
      const cols = (s.from.colors ?? s.parts[0]?.colors ?? ["#5a2e1a"]).map(hexToRgb);
      for (let i = 0; i < N; i++) {
        from[i * 4] = out.pos[i * 2];
        from[i * 4 + 1] = out.pos[i * 2 + 1];
        from[i * 4 + 2] = 0.9;
        from[i * 4 + 3] = baseSize[i] * 0.7;
        const c = cols[Math.floor(seed[i * 4 + 1] * cols.length) % cols.length];
        fromCol.set(c, i * 3);
      }
    }

    // 3. Targets for each part.
    parts = s.parts.slice(0, MAX_PARTS).map((p) => ({ anchor: p.anchor ?? null, sample: rectOf(p.anchor) }));
    offsets.fill(0);
    lastOffsetsKey = "";
    const density = Math.max(0, Math.min(1, s.density ?? 1));
    const used = Math.round(N * density);
    const totalW = s.parts.reduce((sum, p) => sum + (p.weight ?? 1), 0) || 1;

    // Particles are assigned to parts in a shuffled order so each part gets a
    // spread of sizes and kinds.
    let o = 0;
    s.parts.slice(0, MAX_PARTS).forEach((p, pi) => {
      const count = pi === s.parts.length - 1 ? used - o : Math.round((used * (p.weight ?? 1)) / totalW);
      if (count <= 0) return;
      const out: ShapeOut = p.shape(count, parts[pi].sample, r);
      const cols = p.colors.map(hexToRgb);
      for (let k = 0; k < count && o + k < N; k++) {
        const i = o + k;
        to[i * 4] = out.pos[k * 2];
        to[i * 4 + 1] = out.pos[k * 2 + 1];
        to[i * 4 + 2] = (p.alpha ?? 1) * (out.alpha ? out.alpha[k] : 1);
        to[i * 4 + 3] = baseSize[i] * (p.size ?? 1) * (out.size ? out.size[k] : 1) * (W < 640 ? 0.8 : 1);
        toCol.set(cols[Math.floor(seed[i * 4 + 1] * 997) % cols.length], i * 3);
        partIdx[i] = pi;
      }
      o += count;
    });
    // Unused particles drift off and fade.
    for (let i = o; i < N; i++) {
      to[i * 4] = from[i * 4] + (seed[i * 4] - 0.5) * 200;
      to[i * 4 + 1] = from[i * 4 + 1] + (seed[i * 4 + 1] - 0.5) * 200;
      to[i * 4 + 2] = 0;
      to[i * 4 + 3] = from[i * 4 + 3];
      toCol.set(fromCol.subarray(i * 3, i * 3 + 3), i * 3);
      partIdx[i] = 0;
    }

    // Phones: instead of flying across the page (and across the text), the
    // old shape hands back to its drawn still and the new one blooms outward
    // from its own centre. Clean on a small screen, still alive.
    const small = W < 768;
    const bloom = small && !instant && !s.from;
    if (bloom) {
      for (let i = 0; i < N; i++) {
        if (i < o) {
          const rc = parts[partIdx[i] | 0].sample;
          const cx = rc.x + rc.w / 2;
          const cy = rc.y + rc.h / 2;
          const k = 0.1 + 0.2 * seed[i * 4 + 2];
          from[i * 4] = cx + (to[i * 4] - cx) * k;
          from[i * 4 + 1] = cy + (to[i * 4 + 1] - cy) * k;
          from[i * 4 + 3] = to[i * 4 + 3] * 0.4;
        } else {
          to[i * 4] = from[i * 4];
          to[i * 4 + 1] = from[i * 4 + 1];
        }
        from[i * 4 + 2] = 0;
        fromCol.set(toCol.subarray(i * 3, i * 3 + 3), i * 3);
      }
    }

    if (instant) {
      from.set(to);
      fromCol.set(toCol);
    }

    upload();
    scene = s;
    duration = bloom ? Math.min(s.duration ?? 1100, 850) : (s.duration ?? 1100);
    scatterPx = bloom ? 0 : (s.scatter ?? Math.min(W, 1200) * 0.08);
    bloomOn = bloom ? 1 : 0;
    // No idle drift on phones.
    jitter = s.live && !small ? 2.5 : 0;
    start = now;
    settled = instant;
    handedOff = false;
    alphaMul = 1;
    fadeStart = 0;
    if (instant) {
      if (s.handoff) {
        alphaMul = 0;
        handedOff = true;
      }
      s.onSettled?.();
    }
  };

  /* ---------------- render loop ---------------- */

  const draw = (now: number) => {
    const T = progress(now);
    if (gl && prog) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uni.uRes, W, H);
      gl.uniform1f(uni.uDpr, dpr);
      gl.uniform1f(uni.uT, T);
      gl.uniform1f(uni.uScatter, scatterPx);
      gl.uniform1f(uni.uTime, now);
      gl.uniform1f(uni.uJitter, jitter);
      gl.uniform1f(uni.uAlpha, alphaMul);
      gl.uniform4f(uni.uTint, tint[0], tint[1], tint[2], tint[3]);
      gl.uniform2fv(uni.uOff, offsets);
      gl.uniform1f(uni.uBloom, bloomOn);
      gl.drawArrays(gl.POINTS, 0, drawCount);
    } else if (ctx2d) {
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, W, H);
      const tmp = new Float32Array(4);
      const col = new Float32Array(3);
      for (let i = 0; i < N; i++) {
        evalParticle(i, T, tmp, col);
        if (tmp[2] < 0.02) continue;
        const m = tint[3] * (0.55 + 0.45 * seed[i * 4 + 1]);
        const rr = ((col[0] + (tint[0] - col[0]) * m) * 255) | 0;
        const gg = ((col[1] + (tint[1] - col[1]) * m) * 255) | 0;
        const bb = ((col[2] + (tint[2] - col[2]) * m) * 255) | 0;
        ctx2d.fillStyle = `rgba(${rr},${gg},${bb},${tmp[2].toFixed(2)})`;
        ctx2d.beginPath();
        ctx2d.arc(tmp[0], tmp[1], tmp[3] / 2, 0, Math.PI * 2);
        ctx2d.fill();
      }
    }
  };

  const tick = (now: number) => {
    raf = 0;
    if (destroyed) return;
    if (document.hidden) {
      // Nobody is watching: land the scene so page artwork is never left hidden.
      if (!settled && scene) {
        settled = true;
        start = now - duration;
        if (scene.handoff) {
          alphaMul = 0;
          handedOff = true;
        }
        scene.onSettled?.();
      }
      return;
    }

    // Adaptive quality: if the first frames are slow, draw fewer particles.
    if (lastFrame) {
      const dt = now - lastFrame;
      if (frameCount < 90 && dt < 200) {
        frameTimeSum += dt;
        frameCount++;
        if (frameCount === 90 && frameTimeSum / 90 > 24) drawCount = Math.round(N * 0.5);
      }
    }
    lastFrame = now;

    const moved = updateOffsets();
    let needNext = false;
    const wasHidden = handedOff && alphaMul === 0;

    if (!settled) {
      if (now - start >= duration) {
        settled = true;
        const s = scene;
        if (s?.handoff) fadeStart = now;
        s?.onSettled?.();
      }
      needNext = true;
    }
    if (settled && fadeStart && !handedOff) {
      alphaMul = Math.max(0, 1 - (now - fadeStart) / 450);
      if (alphaMul === 0) handedOff = true;
      else needNext = true;
    }
    if (jitter > 0 && !handedOff) needNext = true;

    const hasAnchors = parts.some((p) => p.anchor);
    if (!wasHidden && (needNext || moved || handedOff)) draw(now); // last pass clears the faded field

    if (needNext || (hasAnchors && !handedOff)) schedule();
    else lastFrame = 0;
  };

  const schedule = () => {
    if (!raf && !destroyed) raf = requestAnimationFrame(tick);
  };

  const onResize = () => {
    if (resize() && scene) build({ ...scene, instant: false, duration: 600, from: undefined, onSettled: undefined }, false);
    schedule();
  };
  const onVisibility = () => {
    if (!document.hidden) {
      lastFrame = 0;
      schedule();
    }
  };
  const onScroll = () => schedule();

  resize();
  // Start as an invisible dusting across the viewport.
  for (let i = 0; i < N; i++) {
    from[i * 4] = to[i * 4] = seed[i * 4 + 2] * W;
    from[i * 4 + 1] = to[i * 4 + 1] = seed[i * 4 + 1] * H;
    from[i * 4 + 2] = to[i * 4 + 2] = 0;
    from[i * 4 + 3] = to[i * 4 + 3] = baseSize[i];
    fromCol.set([0.35, 0.18, 0.1], i * 3);
    toCol.set([0.35, 0.18, 0.1], i * 3);
  }
  upload();
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return {
    count: N,
    play(s) {
      if (destroyed) return;
      if (scene && s.id === scene.id && !s.instant) {
        const same =
          s.parts.length === parts.length && s.parts.every((p, i) => (p.anchor ?? null) === parts[i].anchor);
        if (same) {
          scene = { ...scene, onSettled: s.onSettled };
          if (settled) s.onSettled?.();
          return;
        }
      }
      build(s, !!s.instant || document.hidden);
      draw(performance.now());
      schedule();
    },
    setTint(hex, amount) {
      const [r, g, b] = hexToRgb(hex);
      tint = [r, g, b, Math.max(0, Math.min(1, amount))];
      if (!handedOff) {
        draw(performance.now());
        schedule();
      }
    },
    destroy() {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
