"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useFrame, useInView, useReducedMotion } from "../_lib/motion";
import { waveY, wavePath, type Bump, type WaveOptions } from "../_lib/signal";

export function hexPoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

type Node = { u: number; label?: string };

type Props = {
  options?: WaveOptions;
  className?: string;
  /** Anima la onda en el tiempo (si no, queda quieta tras dibujarse). */
  animate?: boolean;
  /** Deformación local con el cursor. */
  interactive?: boolean;
  /** Multiplicador de energía leído en cada frame (p. ej. desde scroll). */
  energyRef?: RefObject<number>;
  nodes?: Node[];
  activeNode?: number | null;
  tone?: "dark" | "light";
  /** Dibuja la línea al entrar en pantalla. */
  drawIn?: boolean;
  /** Desvanece los extremos. */
  fade?: boolean;
};

export function Signal({
  options = {},
  className = "",
  animate = true,
  interactive = false,
  energyRef,
  nodes,
  activeNode = null,
  tone = "dark",
  drawIn = true,
  fade = true,
}: Props) {
  const id = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = useReducedMotion();
  const inView = useInView(svgRef, { rootMargin: "80px" });
  const [drawn, setDrawn] = useState(!drawIn);

  const bump = useRef<Bump>({ x: -9999, strength: 0, width: 120 });
  const target = useRef({ x: -9999, strength: 0 });
  const last = useRef(0);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (inView && !drawn) {
      const t = setTimeout(() => setDrawn(true), 60);
      return () => clearTimeout(t);
    }
  }, [inView, drawn]);

  useEffect(() => {
    if (!interactive || reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = svgRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const near = e.clientY > r.top - 140 && e.clientY < r.bottom + 140;
      target.current.x = e.clientX - r.left;
      target.current.strength = near ? 1 : 0;
    };
    const onLeave = () => (target.current.strength = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [interactive, reduced]);

  const render = (t: number) => {
    const { w, h } = size;
    if (!w || !h) return;
    const energy = (options.energy ?? 1) * (energyRef ? (energyRef.current ?? 1) : 1);
    const o = { ...options, energy };
    // amortiguación del cursor
    const b = bump.current;
    const dt = Math.min(0.05, t - last.current || 0.016);
    last.current = t;
    const k = 1 - Math.exp(-dt * 3.2);
    if (b.x < -9000) b.x = target.current.x;
    b.x += (target.current.x - b.x) * k;
    b.strength += (target.current.strength - b.strength) * k * 0.8;
    b.width = Math.max(80, w * 0.08);
    const d = wavePath(w, h, t, o, b);
    pathRef.current?.setAttribute("d", d);
    glowRef.current?.setAttribute("d", d);
    nodes?.forEach((n, i) => {
      const g = nodeRefs.current[i];
      if (g) g.setAttribute("transform", `translate(${(n.u * w).toFixed(1)} ${waveY(n.u, w, h, t, o, b).toFixed(1)})`);
    });
  };

  const running = inView && !reduced && (animate || interactive || !!energyRef);
  useFrame(render, running);

  // estado estático (reduced motion, fuera de pantalla o sin animación)
  useEffect(() => {
    if (!running) render(animate ? 4 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, running]);

  const stroke = tone === "dark" ? "var(--gold)" : "var(--bronze-deep)";
  const edge = tone === "dark" ? "var(--bronze)" : "var(--bronze)";

  return (
    <svg
      ref={svgRef}
      className={`block overflow-visible ${className}`}
      width="100%"
      height="100%"
      viewBox={size.w ? `0 0 ${size.w} ${size.h}` : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`sg-${id}`} gradientUnits="userSpaceOnUse" x1="0" x2={size.w || 1} y1="0" y2="0">
          <stop offset="0" stopColor={edge} stopOpacity={fade ? 0 : 0.8} />
          <stop offset="0.14" stopColor={edge} stopOpacity="0.85" />
          <stop offset="0.5" stopColor={stroke} stopOpacity="1" />
          <stop offset="0.86" stopColor={edge} stopOpacity="0.85" />
          <stop offset="1" stopColor={edge} stopOpacity={fade ? 0 : 0.8} />
        </linearGradient>
      </defs>
      <path
        ref={glowRef}
        fill="none"
        stroke={stroke}
        strokeOpacity={tone === "dark" ? 0.09 : 0.06}
        strokeWidth={7}
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn || reduced ? 0 : 1,
          transition: "stroke-dashoffset 2.4s var(--ease-out)",
        }}
      />
      <path
        ref={pathRef}
        fill="none"
        stroke={`url(#sg-${id})`}
        strokeWidth={1.25}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: drawn || reduced ? 0 : 1,
          transition: "stroke-dashoffset 2.4s var(--ease-out)",
        }}
      />
      {nodes?.map((n, i) => {
        const active = activeNode === i;
        return (
          <g key={i} ref={(el) => void (nodeRefs.current[i] = el)}>
            <polygon
              points={hexPoints(0, 0, 11)}
              fill="none"
              stroke={stroke}
              strokeOpacity={active ? 0.9 : 0}
              strokeWidth={1}
              style={{ transition: "stroke-opacity .5s var(--ease-out)" }}
            />
            <polygon
              points={hexPoints(0, 0, 4.5)}
              fill={active ? stroke : tone === "dark" ? "var(--night)" : "var(--ivory)"}
              stroke={stroke}
              strokeWidth={1}
              style={{ transition: "fill .4s var(--ease-out)" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
