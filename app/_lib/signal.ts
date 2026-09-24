// Geometría de la Señal Lago: una línea continua hecha de pocas senoides
// lentas. `bump` es la perturbación local del cursor (propagación).

export type WaveOptions = {
  /** Altura relativa (0–1) al inicio y al final: permite diagonales. */
  from?: number;
  to?: number;
  /** Amplitud relativa a la altura. */
  amplitude?: number;
  /** Multiplicador de amplitud (0 = línea recta). */
  energy?: number;
  /** Reduce la amplitud hacia los extremos. */
  taper?: boolean;
  /** Número de ondulaciones visibles. */
  frequency?: number;
  phase?: number;
  samples?: number;
};

export type Bump = { x: number; strength: number; width: number };

export function waveY(
  u: number,
  w: number,
  h: number,
  t: number,
  o: WaveOptions,
  bump?: Bump,
) {
  const { from = 0.5, to = 0.5, amplitude = 0.18, energy = 1, taper = false, frequency = 1.2, phase = 0 } = o;
  const base = from + (to - from) * u;
  const TAU = Math.PI * 2;
  let s =
    0.58 * Math.sin(TAU * frequency * u + t * 0.32 + phase) +
    0.29 * Math.sin(TAU * frequency * 2.3 * u - t * 0.47 + 1.3 + phase) +
    0.13 * Math.sin(TAU * frequency * 4.6 * u + t * 0.81 + 2.1);
  if (taper) s *= Math.pow(Math.sin(Math.PI * u), 0.6);
  let y = (base + s * amplitude * energy) * h;
  if (bump && bump.strength > 0.001) {
    const d = u * w - bump.x;
    const g = Math.exp(-(d * d) / (2 * bump.width * bump.width));
    y += bump.strength * g * h * 0.09 * Math.cos((d / bump.width) * 2.4 - t * 2.2);
  }
  return y;
}

export function wavePath(w: number, h: number, t: number, o: WaveOptions, bump?: Bump) {
  const n = o.samples ?? Math.max(48, Math.min(180, Math.round(w / 9)));
  let d = "";
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = u * w;
    const y = waveY(u, w, h, t, o, bump);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}
