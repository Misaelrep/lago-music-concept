"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Asset } from "../_lib/assets";
import type { ArchiveEntry } from "../_lib/content";
import { scrollProgress, useInView, useReducedMotion } from "../_lib/motion";
import { HexField } from "./Hex";

export type ArchivePiece = ArchiveEntry & { asset: Asset | null };

// Composición desktop por posición (más reciente primero). Profundidad mínima.
const LAYOUT = [
  { place: "md:col-span-6", depth: 0 },
  { place: "md:col-span-5 md:col-start-8 md:mt-40", depth: 1 },
  { place: "md:col-span-5 md:col-start-2", depth: -1 },
  { place: "md:col-span-4 md:col-start-8 md:mt-24", depth: 0.6 },
];

function FlyerPiece({ p }: { p: ArchivePiece & { asset: Asset } }) {
  return (
    <>
      <div className="relative overflow-hidden bg-night shadow-[0_40px_80px_-40px_rgba(0,0,0,.95)] ring-1 ring-ivory/10 transition-[box-shadow] group-focus-visible:ring-gold">
        <Image
          src={p.asset.src}
          alt={p.flyerAlt ?? `Flyer de ${p.title} ${p.year}`}
          width={p.asset.width}
          height={p.asset.height}
          quality={90}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-5 grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-1">
        <span className="display row-span-2 text-4xl text-gold md:text-5xl">{p.year}</span>
        <span className="display text-2xl font-semibold md:text-3xl">{p.title}</span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="label text-ivory/50">Flyer oficial</span>
          <a
            href={p.asset.src}
            target="_blank"
            rel="noopener"
            className="link-line label text-ivory/70 hover:text-gold"
          >
            Ver completo <span className="arrow" aria-hidden="true">↗</span>
          </a>
        </span>
      </figcaption>
    </>
  );
}

/** Ficha histórica textual: pieza intencional mientras se recupera el material gráfico. */
function RecordPiece({ p }: { p: ArchivePiece }) {
  return (
    <div className="relative overflow-hidden border border-ivory/12 bg-graphite/60 p-7 transition-colors group-focus-visible:border-gold md:p-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 [mask-image:radial-gradient(closest-side,black,transparent)]">
        <HexField size={12} opacity={0.18} />
      </div>
      <div className="relative flex items-center justify-between gap-4">
        <span className="label text-gold">Ficha de archivo</span>
        <span className="label text-ivory/40">{p.year}</span>
      </div>
      <p
        className="display relative mt-8 text-[clamp(4.5rem,9vw,8rem)] font-bold leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--gold)]"
        aria-hidden="true"
      >
        {p.year}
      </p>
      <h3 className="display relative mt-5 text-3xl font-semibold md:text-4xl">{p.title}</h3>
      {p.summary && <p className="serif relative mt-5 text-lg leading-snug text-ivory/80 md:text-xl">{p.summary}</p>}
      {p.facts && (
        <ul className="relative mt-7 border-t border-ivory/12">
          {p.facts.map((f) => (
            <li key={f} className="label border-b border-ivory/12 py-3 text-ivory/65">
              {f}
            </li>
          ))}
        </ul>
      )}
      <p className="label relative mt-7 flex items-center gap-2.5 text-ivory/40">
        <svg viewBox="0 0 10 11.5" className="w-2" aria-hidden="true">
          <polygon points="5,0 10,2.9 10,8.6 5,11.5 0,8.6 0,2.9" fill="none" stroke="currentColor" />
        </svg>
        Material gráfico en recuperación
      </p>
    </div>
  );
}

export function ArchiveWall({ pieces }: { pieces: ArchivePiece[] }) {
  const wall = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(wall, { rootMargin: "100px" });

  useEffect(() => {
    const el = wall.current;
    if (!el || reduced || !inView) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      el.style.setProperty("--p", scrollProgress(el).toFixed(4));
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

  return (
    <div
      ref={wall}
      className="flyer-wall mt-16 grid gap-y-16 px-[var(--gutter)] md:mt-24 md:grid-cols-12 md:gap-x-6 md:gap-y-24"
      style={{ "--p": 0.5 } as React.CSSProperties}
    >
      {pieces.map((p, i) => {
        const l = LAYOUT[i % LAYOUT.length];
        return (
          <figure
            key={p.id}
            id={p.id}
            tabIndex={0}
            aria-label={`${p.title} ${p.year}`}
            className={`flyer group scroll-mt-28 self-start outline-none ${l.place}`}
            style={{ transform: `translate3d(0, calc((var(--p) - 0.5) * ${l.depth * -48}px), 0)` }}
          >
            {p.asset ? <FlyerPiece p={{ ...p, asset: p.asset }} /> : <RecordPiece p={p} />}
          </figure>
        );
      })}
    </div>
  );
}
