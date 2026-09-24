"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { scrollProgress, useInView, useReducedMotion } from "../_lib/motion";
import { wavePath } from "../_lib/signal";
import { HexField } from "./Hex";
import { Reveal } from "./Reveal";

type Piece = {
  id: string;
  code: string;
  note: string;
  depth: number;
  /** Posición en la pared (desktop). */
  place: string;
  aspect: string;
  art: React.ReactNode;
};

const staticWave = wavePath(400, 120, 2.2, { from: 0.55, to: 0.45, amplitude: 0.28, frequency: 1.4 });

const PIECES: Piece[] = [
  {
    id: "p1",
    code: "A1",
    note: "Cartel · concierto",
    depth: 0,
    place: "md:col-span-4 md:row-span-2",
    aspect: "aspect-[2/3] md:aspect-[3/5]",
    art: (
      <div className="relative h-full w-full bg-carbon text-ivory">
        <Image src="/images/spot-stage.jpg" alt="" fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover opacity-90" />
        <div className="absolute inset-0 flex flex-col justify-between p-[7%]">
          <div className="flex justify-between">
            <span className="label whitespace-nowrap text-[8px] md:text-[11px]">Lago presenta</span>
            <span className="label hidden whitespace-nowrap text-[8px] text-gold sm:inline md:text-[11px]">En vivo</span>
          </div>
          <div>
            <p className="display text-[clamp(4rem,11vw,10rem)] font-bold leading-[0.75]">14</p>
            <p className="display mt-3 text-[clamp(1.1rem,2.4vw,2.2rem)] font-semibold">Banda Torera<br />del Valle</p>
            <p className="label mt-3 text-[9px] text-ivory/70 md:text-[11px]">Nov · Jalisco</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "p2",
    code: "B1",
    note: "Cartel · formato club",
    depth: 1,
    place: "md:col-span-3 md:mt-24",
    aspect: "aspect-square",
    art: (
      <div className="relative flex h-full w-full flex-col bg-graphite p-[8%] text-ivory">
        <div className="relative flex-1 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
          <Image src="/images/rig-lights.jpg" alt="" fill sizes="25vw" className="object-cover" />
        </div>
        <p className="display mt-4 text-center text-[clamp(1.4rem,2.6vw,2.4rem)] font-semibold">Noche Lago</p>
      </div>
    ),
  },
  {
    id: "p3",
    code: "C1",
    note: "Cartel · ciclo",
    depth: -1,
    place: "md:col-span-3 md:col-start-8",
    aspect: "aspect-[3/4]",
    art: (
      <div className="relative flex h-full w-full flex-col justify-between bg-ivory p-[9%] text-night">
        <div className="flex justify-between border-b border-night/20 pb-3">
          <span className="label text-[9px] md:text-[10px]">Ciclo</span>
          <span className="label text-[9px] text-bronze-deep md:text-[10px]">Nuevas propuestas</span>
        </div>
        <p className="serif text-[clamp(2rem,4.4vw,4rem)] italic leading-[0.9]">
          Escenario
          <br />
          abierto
        </p>
        <div className="space-y-1.5 border-t border-night/20 pt-3">
          {["Convocatoria", "Sesiones", "Muestra"].map((t) => (
            <p key={t} className="label flex justify-between text-[9px] md:text-[10px]">
              <span>{t}</span>
              <span className="text-bronze-deep">—</span>
            </p>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "p4",
    code: "D1",
    note: "Tira · festival",
    depth: 1,
    place: "md:col-span-2 md:row-span-2 md:mt-10",
    aspect: "aspect-[1/2.3]",
    art: (
      <div className="relative h-full w-full bg-carbon">
        <Image src="/images/structure-loadin.jpg" alt="" fill sizes="17vw" className="object-cover object-[45%_50%]" />
        <p className="display absolute bottom-[5%] left-1/2 origin-center -translate-x-1/2 whitespace-nowrap text-[clamp(1.6rem,3vw,3rem)] font-bold text-ivory [writing-mode:vertical-rl] rotate-180">
          Gran formato
        </p>
      </div>
    ),
  },
  {
    id: "p5",
    code: "T1",
    note: "Boleto · pieza de archivo",
    depth: -1,
    place: "md:col-span-3 md:col-start-5 md:mt-4",
    aspect: "aspect-[2/1]",
    art: (
      <div className="relative flex h-full w-full bg-bronze text-night">
        <div className="flex flex-1 flex-col justify-between p-[6%]">
          <span className="label text-[8px] md:text-[10px]">Admite uno</span>
          <p className="display text-[clamp(1.4rem,2.6vw,2.4rem)] font-bold leading-none">Lago Music</p>
          <span className="label text-[8px] md:text-[10px]">Concepto</span>
        </div>
        {/* perforación hexagonal */}
        <div className="flex w-[14%] flex-col items-center justify-evenly border-l border-dashed border-night/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <svg key={i} viewBox="0 0 10 11.5" className="w-[34%]" aria-hidden="true">
              <polygon points="5,0 10,2.9 10,8.6 5,11.5 0,8.6 0,2.9" fill="var(--night)" opacity=".85" />
            </svg>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "p6",
    code: "S1",
    note: "Cartel · sesiones",
    depth: 1,
    place: "md:col-span-3 md:col-start-8 md:-mt-10",
    aspect: "aspect-[4/5] md:aspect-square",
    art: (
      <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-night p-[9%] text-ivory">
        <HexField size={10} opacity={0.08} />
        <p className="label relative text-[9px] text-gold md:text-[10px]">Sesiones en vivo</p>
        <svg viewBox="0 0 400 120" className="relative w-full" aria-hidden="true">
          <path d={staticWave} fill="none" stroke="var(--gold)" strokeWidth="1.5" />
        </svg>
        <div className="relative">
          <p className="display text-[clamp(1.8rem,3.4vw,3.2rem)] font-semibold leading-none">Sonido<br />en sala</p>
          <p className="label mt-3 text-[9px] text-ivory/60 md:text-[10px]">Nov · Dic · Ene</p>
        </div>
      </div>
    ),
  },
  {
    id: "p7",
    code: "B2",
    note: "Gran formato · horizontal",
    depth: 0,
    place: "md:col-span-6 md:col-start-2",
    aspect: "aspect-[16/9]",
    art: (
      <div className="relative h-full w-full bg-carbon text-ivory">
        <Image src="/images/crowd-wash.jpg" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-carbon/90 to-transparent p-[4%] pt-[12%]">
          <p className="display text-[clamp(1.6rem,4vw,4rem)] font-bold leading-[0.85]">Cultura<br />en vivo</p>
          <p className="label text-right text-[9px] text-gold md:text-[11px]">Lago presenta<br />Jalisco</p>
        </div>
      </div>
    ),
  },
  {
    id: "p8",
    code: "M1",
    note: "Tipográfico · manifiesto",
    depth: -1,
    place: "md:col-span-3 md:col-start-9 md:mt-16",
    aspect: "aspect-square",
    art: (
      <div className="grid h-full w-full grid-cols-2 grid-rows-3 bg-gold text-night">
        {["Even", "tos", "Mú", "sica", "Cul", "tura"].map((t, i) => (
          <span
            key={i}
            className={`display flex items-end p-[8%] text-[clamp(1.4rem,3vw,2.8rem)] font-bold leading-none ${
              i % 2 ? "justify-start" : "justify-end"
            } ${i < 4 ? "border-b border-night/25" : ""} ${i % 2 === 0 ? "border-r border-night/25" : ""}`}
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
];

export function Flyers() {
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
    <section id="archivo" aria-labelledby="archivo-title" className="relative overflow-hidden bg-carbon py-24 md:py-36">
      <div className="px-[var(--gutter)]">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="label text-gold md:col-span-3">Archivo</p>
          <h2 id="archivo-title" className="display text-[clamp(3.2rem,9vw,8.5rem)] font-semibold md:col-span-6">
            Pared de
            <br />
            flyers
          </h2>
          <p className="serif text-lg italic leading-snug text-ivory/60 md:col-span-3">
            Piezas conceptuales para imaginar la memoria gráfica de Lago.
          </p>
        </Reveal>
      </div>

      <div
        ref={wall}
        className="flyer-wall mt-16 grid grid-cols-2 gap-x-3 gap-y-8 px-[var(--gutter)] md:mt-24 md:grid-flow-dense md:grid-cols-12 md:gap-x-6 md:gap-y-10"
        style={{ "--p": 0.5 } as React.CSSProperties}
      >
        {PIECES.map((p) => (
          <figure
            key={p.id}
            tabIndex={0}
            aria-label={`Pieza ${p.code}: ${p.note}`}
            className={`flyer group self-start outline-none ${p.place} ${p.id === "p7" ? "col-span-2" : ""}`}
            style={{ transform: `translate3d(0, calc((var(--p) - 0.5) * ${p.depth * -70}px), 0)` }}
          >
            <div
              className={`relative overflow-hidden ${p.aspect} shadow-[0_30px_60px_-30px_rgba(0,0,0,.9)] transition-[outline-color] group-focus-visible:outline group-focus-visible:outline-1 group-focus-visible:outline-offset-4 group-focus-visible:outline-gold`}
            >
              {p.art}
            </div>
            <figcaption className="mt-3 flex justify-between gap-3">
              <span className="label text-ivory/70">Pieza {p.code}</span>
              <span className="label hidden text-ivory/40 sm:inline">{p.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="label mt-16 px-[var(--gutter)] text-ivory/35">Todas las piezas son conceptuales · fechas demo</p>
    </section>
  );
}
