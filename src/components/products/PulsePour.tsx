"use client";

import { useEffect, useRef, useState } from "react";

type Grain = { color: string; r: number; squash: number };

const PULSES: Record<string, { label: string; grains: Grain[] }> = {
  toor: {
    label: "Toor",
    grains: [
      { color: "#DDAE45", r: 3.4, squash: 0.8 },
      { color: "#C99A30", r: 3.2, squash: 0.8 },
      { color: "#E8C063", r: 3.3, squash: 0.8 },
    ],
  },
  moong: {
    label: "Moong",
    grains: [
      { color: "#6E8B3D", r: 3, squash: 0.75 },
      { color: "#58732D", r: 2.9, squash: 0.75 },
      { color: "#7F9C4A", r: 3.1, squash: 0.75 },
    ],
  },
  urad: {
    label: "Urad",
    grains: [
      { color: "#2E2A27", r: 3, squash: 0.78 },
      { color: "#1F1C1A", r: 2.9, squash: 0.78 },
      { color: "#3D3834", r: 3.1, squash: 0.78 },
    ],
  },
  chana: {
    label: "Chana",
    grains: [
      { color: "#B98A4B", r: 4.6, squash: 0.92 },
      { color: "#A47639", r: 4.4, squash: 0.92 },
      { color: "#C79B5E", r: 4.7, squash: 0.92 },
    ],
  },
  masoor: {
    label: "Masoor",
    grains: [
      { color: "#CF5F39", r: 2.8, squash: 0.62 },
      { color: "#BC4F2B", r: 2.7, squash: 0.62 },
      { color: "#DB7250", r: 2.9, squash: 0.62 },
    ],
  },
};

const MAX = 900;
const GRAVITY = 1500;

/**
 * Hold to pour: a small grain simulation. Mouse or touch pours from the
 * scoop wherever you press; the Pour button does the same for keyboards.
 */
export default function PulsePour() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulse, setPulse] = useState<keyof typeof PULSES>("toor");
  const [count, setCount] = useState(0);
  const api = useRef<{ pour: (on: boolean, x?: number) => void; clear: () => void; setPulse: (k: string) => void } | null>(
    null,
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const x = new Float32Array(MAX);
    const y = new Float32Array(MAX);
    const vx = new Float32Array(MAX);
    const vy = new Float32Array(MAX);
    const r = new Float32Array(MAX);
    const sq = new Float32Array(MAX);
    const rot = new Float32Array(MAX);
    const col: string[] = new Array(MAX);
    let n = 0;
    let pouring = false;
    let scoopX = 0.5;
    let kind = "toor";
    let raf = 0;
    let last = 0;
    let quiet = 0;
    let frames = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      draw();
    };

    const emit = () => {
      const grains = PULSES[kind].grains;
      for (let k = 0; k < 3 && n < MAX; k++) {
        const g = grains[(Math.random() * grains.length) | 0];
        const sx = Math.max(24, Math.min(W - 24, scoopX * W));
        x[n] = sx + 22 + (Math.random() - 0.5) * 8;
        y[n] = 58 + Math.random() * 4;
        vx[n] = 40 + Math.random() * 60;
        vy[n] = 20 + Math.random() * 40;
        r[n] = g.r * (0.9 + Math.random() * 0.2);
        sq[n] = g.squash;
        rot[n] = Math.random() * Math.PI;
        col[n] = g.color;
        n++;
      }
    };

    const CELL = 10;
    const step = (dt: number) => {
      const floor = H - 6;
      let energy = 0;
      for (let i = 0; i < n; i++) {
        vy[i] += GRAVITY * dt;
        x[i] += vx[i] * dt;
        y[i] += vy[i] * dt;
        if (y[i] > floor - r[i]) {
          y[i] = floor - r[i];
          vy[i] *= -0.15;
          vx[i] *= 0.8;
        }
        if (x[i] < r[i]) {
          x[i] = r[i];
          vx[i] *= -0.3;
        } else if (x[i] > W - r[i]) {
          x[i] = W - r[i];
          vx[i] *= -0.3;
        }
      }
      // Grain-on-grain contacts through a spatial hash.
      const cols = Math.ceil(W / CELL) + 1;
      const grid = new Map<number, number[]>();
      for (let i = 0; i < n; i++) {
        const key = ((y[i] / CELL) | 0) * cols + ((x[i] / CELL) | 0);
        const cell = grid.get(key);
        if (cell) cell.push(i);
        else grid.set(key, [i]);
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < n; i++) {
          const cx = (x[i] / CELL) | 0;
          const cy = (y[i] / CELL) | 0;
          for (let oy = -1; oy <= 1; oy++) {
            for (let ox = -1; ox <= 1; ox++) {
              const cell = grid.get((cy + oy) * cols + cx + ox);
              if (!cell) continue;
              for (const j of cell) {
                if (j <= i) continue;
                const dx = x[j] - x[i];
                const dy = y[j] - y[i];
                const min = r[i] + r[j];
                const d2 = dx * dx + dy * dy;
                if (d2 >= min * min || d2 === 0) continue;
                const d = Math.sqrt(d2);
                const push = (min - d) / 2;
                const nx = dx / d;
                const ny = dy / d;
                x[i] -= nx * push;
                y[i] -= ny * push;
                x[j] += nx * push;
                y[j] += ny * push;
                // exchange a little momentum along the normal, with friction
                const rv = (vx[j] - vx[i]) * nx + (vy[j] - vy[i]) * ny;
                if (rv < 0) {
                  const imp = rv * 0.55;
                  vx[i] += imp * nx;
                  vy[i] += imp * ny;
                  vx[j] -= imp * nx;
                  vy[j] -= imp * ny;
                }
                vx[i] *= 0.985;
                vx[j] *= 0.985;
              }
            }
          }
        }
      }
      for (let i = 0; i < n; i++) energy += Math.abs(vx[i]) + Math.abs(vy[i]);
      return n ? energy / n : 0;
    };

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      // scoop
      const sx = Math.max(24, Math.min(W - 24, scoopX * W));
      ctx!.save();
      ctx!.translate(sx, 44);
      ctx!.rotate(pouring ? 0.55 : 0.1);
      ctx!.fillStyle = "#6B3A22";
      ctx!.beginPath();
      ctx!.moveTo(-26, -10);
      ctx!.lineTo(24, -10);
      ctx!.quadraticCurveTo(26, 14, 0, 16);
      ctx!.quadraticCurveTo(-24, 14, -26, -10);
      ctx!.fill();
      ctx!.fillRect(-44, -8, 20, 5);
      ctx!.restore();
      for (let i = 0; i < n; i++) {
        ctx!.fillStyle = col[i];
        ctx!.beginPath();
        ctx!.ellipse(x[i], y[i], r[i], r[i] * sq[i], rot[i], 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(1 / 30, (now - (last || now)) / 1000) || 1 / 60;
      last = now;
      if (pouring) emit();
      const e1 = step(dt / 2);
      const e2 = step(dt / 2);
      draw();
      quiet = !pouring && (e1 + e2) / 2 < 8 ? quiet + 1 : 0;
      if (quiet < 30) raf = requestAnimationFrame(tick);
      else last = 0;
      if (++frames % 12 === 0 || !raf) setCount(n);
    };
    const wake = () => {
      quiet = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    api.current = {
      pour(on, px) {
        pouring = on && n < MAX;
        if (px !== undefined) scoopX = px;
        wake();
      },
      clear() {
        n = 0;
        setCount(0);
        draw();
      },
      setPulse(k) {
        kind = k;
      },
    };

    const toX = (e: PointerEvent) => (e.clientX - canvas.getBoundingClientRect().left) / W;
    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      api.current?.pour(true, toX(e));
    };
    const move = (e: PointerEvent) => {
      scoopX = toX(e);
      if (!pouring) draw();
    };
    const up = () => api.current?.pour(false);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", up);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", up);
    };
  }, []);

  useEffect(() => {
    api.current?.setPulse(pulse);
  }, [pulse]);

  const full = count >= MAX;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Choose a pulse">
        {Object.entries(PULSES).map(([k, v]) => (
          <button
            key={k}
            type="button"
            aria-pressed={pulse === k}
            onClick={() => setPulse(k)}
            className="mono-label flex items-center gap-2 rounded-full border border-rule px-3.5 py-2 text-brown transition-colors aria-pressed:border-ink aria-pressed:text-ink"
          >
            <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: v.grains[0].color }} />
            {v.label}
          </button>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        data-cursor="Pour"
        className="mt-6 h-[340px] w-full touch-none select-none rounded-[4px] bg-paper-2 md:h-[420px]"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          disabled={full}
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse" && e.pointerType !== "touch") return;
            api.current?.pour(true, 0.3 + Math.random() * 0.4);
          }}
          onPointerUp={() => api.current?.pour(false)}
          onPointerLeave={() => api.current?.pour(false)}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              api.current?.pour(true, 0.5);
            }
          }}
          onKeyUp={() => api.current?.pour(false)}
          className="mono-label rounded-full bg-ink px-5 py-3 text-paper transition-colors hover:bg-green disabled:opacity-40"
        >
          Hold to pour
        </button>
        <button
          type="button"
          onClick={() => api.current?.clear()}
          className="mono-label link-draw text-brown"
        >
          Empty the tray
        </button>
        <p className="mono-label text-brown">{full ? "Tray full" : `${count} grains`}</p>
        <p className="sr-only" aria-live="polite">
          {full ? "The tray is full." : ""}
        </p>
      </div>
    </div>
  );
}
