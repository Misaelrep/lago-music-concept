"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "../_lib/motion";
import { Signal } from "./Signal";

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Bisagra entre lo que Lago presenta y lo que puede producir:
 * con el scroll, la Señal pierde amplitud hasta quedar recta.
 */
export function Transition() {
  const wrap = useRef<HTMLDivElement>(null);
  const energy = useRef(1);
  const reduced = useReducedMotion();
  const inView = useInView(wrap);
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (reduced) {
      energy.current = 0;
      return;
    }
    const el = wrap.current;
    if (!el || !inView) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, run)));
      energy.current = 1 - smooth(0.05, 0.7, p);
      setPhrase(smooth(0.35, 0.75, p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced, inView]);

  const shown = reduced ? 1 : phrase;

  return (
    <div ref={wrap} className="relative bg-night motion-safe:h-[220vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-48 -translate-y-1/2">
          <Signal energyRef={energy} options={{ amplitude: 0.3, frequency: 1.05, phase: 0.4 }} fade={false} />
        </div>
        <p
          className="serif relative mt-56 max-w-[22ch] px-[var(--gutter)] text-center text-[clamp(1.6rem,3.4vw,3rem)] italic leading-tight text-ivory"
          style={{ opacity: shown, transform: `translateY(${(1 - shown) * 16}px)` }}
        >
          Todo lo que viste empezó como una conversación.
        </p>
      </div>
      {/* Borde hexagonal: el corte negro → marfil */}
      <svg className="absolute inset-x-0 -bottom-px block h-[14px] w-full" aria-hidden="true">
        <defs>
          <pattern id="hex-edge" width="24" height="14" patternUnits="userSpaceOnUse">
            <polygon points="0,0 8,0 12,6.93 20,6.93 24,0 24,14 0,14" fill="var(--ivory)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex-edge)" />
      </svg>
    </div>
  );
}
