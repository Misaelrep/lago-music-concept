"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useInView, useReducedMotion } from "../_lib/motion";
import { wavePath, type Bump, type WaveOptions } from "../_lib/signal";

const WAVE: WaveOptions = { from: 0.64, to: 0.4, amplitude: 0.075, frequency: 1.1, phase: 0.6 };

/**
 * La Señal atraviesa la fotografía del hero. Una copia de la imagen,
 * ligeramente más luminosa y cálida, sólo es visible en una franja difusa
 * que sigue a la línea: la señal "activa" la escena.
 */
export function HeroSignal({ src }: { src: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();
  const inView = useInView(wrap);
  const bump = useRef<Bump>({ x: -9999, strength: 0, width: 160 });
  const target = useRef({ x: 0, strength: 0 });
  const last = useRef(0);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      target.current.x = e.clientX - r.left;
      target.current.strength = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  const render = (t: number) => {
    const { w, h } = size;
    if (!w) return;
    const b = bump.current;
    const dt = Math.min(0.05, t - last.current || 0.016);
    last.current = t;
    const k = 1 - Math.exp(-dt * 2.6);
    if (b.x < -9000) b.x = target.current.x;
    b.x += (target.current.x - b.x) * k;
    b.strength += (target.current.strength - b.strength) * k * 0.7;
    b.width = Math.max(120, w * 0.09);
    // en formato vertical la onda se aplana para no volverse un pico
    const amplitude = (WAVE.amplitude ?? 0.1) * Math.min(1, Math.max(0.4, w / h));
    const d = wavePath(w, h, t, { ...WAVE, amplitude }, b);
    svg.current?.querySelectorAll("path[data-wave]").forEach((p) => p.setAttribute("d", d));
  };

  useFrame(render, inView && !reduced);
  useEffect(() => {
    if (reduced || !inView) render(3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, reduced, inView]);

  const { w, h } = size;

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {w > 0 && (
        <svg ref={svg} width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0">
          <defs>
            <filter id="hero-activate" colorInterpolationFilters="sRGB">
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.02" intercept="0.01" />
                <feFuncG type="linear" slope="0.93" intercept="0.005" />
                <feFuncB type="linear" slope="0.74" />
              </feComponentTransfer>
            </filter>
            <filter id="hero-soft" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation={Math.round(Math.min(w, h) * 0.025)} />
            </filter>
            <mask id="hero-band" maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
              <rect width={w} height={h} fill="black" />
              <g filter="url(#hero-soft)">
              <path data-wave="" fill="none" stroke="white" strokeOpacity="0.14" strokeWidth={Math.max(120, Math.min(w, h) * 0.3)} strokeLinecap="round" />
              <path data-wave="" fill="none" stroke="white" strokeOpacity="0.2" strokeWidth={Math.max(60, Math.min(w, h) * 0.14)} strokeLinecap="round" />
              <path data-wave="" fill="none" stroke="white" strokeOpacity="0.28" strokeWidth={Math.max(24, Math.min(w, h) * 0.05)} strokeLinecap="round" />
              </g>
            </mask>
            <linearGradient id="hero-line" gradientUnits="userSpaceOnUse" x1="0" x2={w} y1="0" y2="0">
              <stop offset="0" stopColor="var(--bronze)" stopOpacity="0" />
              <stop offset="0.18" stopColor="var(--bronze)" stopOpacity="0.8" />
              <stop offset="0.55" stopColor="var(--gold)" />
              <stop offset="0.9" stopColor="var(--bronze)" stopOpacity="0.8" />
              <stop offset="1" stopColor="var(--bronze)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <image
            href={src}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid slice"
            filter="url(#hero-activate)"
            mask="url(#hero-band)"
          />
          <path data-wave="" fill="none" stroke="var(--gold)" strokeOpacity="0.1" strokeWidth="8" strokeLinecap="round" />
          <path data-wave="" fill="none" stroke="url(#hero-line)" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
