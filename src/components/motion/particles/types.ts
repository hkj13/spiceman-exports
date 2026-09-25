export type Rect = { x: number; y: number; w: number; h: number };

export type ShapeOut = {
  /** x,y pairs in viewport pixels */
  pos: Float32Array;
  /** Optional per-point size multiplier */
  size?: Float32Array;
  /** Optional per-point alpha */
  alpha?: Float32Array;
};

export type ShapeFn = (count: number, rect: Rect, rng: () => number) => ShapeOut;

export type ScenePart = {
  /** Element whose box the shape is fitted to. Falls back to the viewport. */
  anchor?: Element | null;
  shape: ShapeFn;
  /** Hex colours; each particle picks one */
  colors: readonly string[];
  /** Share of the particle budget relative to other parts */
  weight?: number;
  /** Particle size multiplier */
  size?: number;
  /** Particle opacity */
  alpha?: number;
};

export type Scene = {
  /** Scenes with the same id and anchors are not replayed */
  id: string;
  parts: ScenePart[];
  /** Optional spawn shape; otherwise particles start where they are */
  from?: { anchor?: Element | null; shape: ShapeFn; colors?: readonly string[] };
  /** Morph duration in ms */
  duration?: number;
  /** Mid-flight spread in px */
  scatter?: number;
  /** Fraction of particles used (the rest fade out) */
  density?: number;
  /** Fade particles out once settled so crisp SVG/DOM can take over */
  handoff?: boolean;
  /** Keep a gentle drift going after settling */
  live?: boolean;
  /** Keep the flowing flight between shapes on phones too (no in-place bloom) */
  flow?: boolean;
  /** Skip the morph (used when the layer boots onto an already-rendered page) */
  instant?: boolean;
  onSettled?: () => void;
};

export type Tier = "high" | "mid" | "low" | "off";

export interface Engine {
  readonly count: number;
  play(scene: Scene): void;
  /** Pull every particle's colour toward `hex` by `amount` (0..1) */
  setTint(hex: string, amount: number): void;
  destroy(): void;
}
