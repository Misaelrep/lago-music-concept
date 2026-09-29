"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EXAMPLE_EVENTS } from "../_lib/content";
import { HexMark } from "./Hex";
import { Reveal } from "./Reveal";
import { Signal } from "./Signal";

/**
 * Cartelera. Mientras no haya fechas confirmadas, muestra sólo ejemplos de
 * formato, rotulados como tales y sin fechas inventadas.
 */
export function Events() {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const list = listRef.current;
    const prev = previewRef.current;
    if (!list || !prev || e.pointerType === "touch") return;
    const r = list.getBoundingClientRect();
    prev.style.setProperty("--x", `${e.clientX - r.left}px`);
    prev.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative bg-night pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="px-[var(--gutter)]">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="label text-gold md:col-span-3">Cartelera</p>
          <h2 id="eventos-title" className="display text-[clamp(2.8rem,6.4vw,6rem)] font-semibold md:col-span-6">
            Próximos eventos
          </h2>
          <p className="label text-ivory/55 md:col-span-3 md:text-right">Fechas por anunciar</p>
        </Reveal>
        <Reveal className="mt-8 grid md:grid-cols-12" delay={80}>
          <p className="serif text-xl italic leading-snug text-ivory/70 md:col-span-6 md:col-start-4 md:text-2xl">
            Las próximas fechas se publicarán aquí. Mientras tanto, estos son los formatos de la cartelera.
          </p>
        </Reveal>
      </div>

      <div className="mt-12 h-24 md:mt-16 md:h-28">
        <Signal
          options={{ from: 0.5, to: 0.5, amplitude: 0.2, frequency: 0.9, phase: 2 }}
          nodes={EXAMPLE_EVENTS.map((_, i) => ({ u: 0.22 + i * 0.28 }))}
          activeNode={active}
          interactive
        />
      </div>

      <div
        ref={listRef}
        className="relative mt-10 px-[var(--gutter)] md:mt-14"
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
      >
        <ul className="border-t border-ivory/15">
          {EXAMPLE_EVENTS.map((ev, i) => {
            const dim = active !== null && active !== i;
            return (
              <li
                key={ev.id}
                id={ev.id}
                tabIndex={0}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={`relative border-b border-ivory/15 outline-none transition-opacity duration-500 focus-visible:bg-ivory/[.03] ${dim ? "opacity-35" : "opacity-100"}`}
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-3 py-7 md:grid-cols-12 md:gap-6 md:py-8">
                  <HexMark className="h-9 w-8 text-gold/80 md:col-span-1 md:h-10 md:w-9">
                    <span className="label !tracking-normal">{ev.marker}</span>
                  </HexMark>
                  <p className="display text-2xl text-ivory/35 md:col-span-2 md:text-3xl">
                    Por
                    <br className="hidden md:block" /> anunciar
                  </p>
                  <div className="col-span-2 md:col-span-6">
                    <p className="label text-gold/90">{ev.kicker}</p>
                    <h3 className="display mt-2 text-4xl font-semibold md:text-5xl">{ev.title}</h3>
                    <p className="label mt-3 text-ivory/50">{ev.format}</p>
                  </div>
                  <p className="label col-span-2 text-ivory/40 md:col-span-3 md:text-right">Próximamente</p>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Vista previa que sigue al cursor (sólo desktop) */}
        <div
          ref={previewRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 hidden [@media(hover:hover)_and_(min-width:768px)]:block"
          style={{ transform: "translate3d(calc(var(--x, 0px) + 28px), var(--y, 0px), 0)" }}
        >
          <div
            className={`relative aspect-[4/5] w-[min(20vw,280px)] -translate-y-1/2 overflow-hidden transition-[opacity,scale] duration-500 ease-[var(--ease-out)] ${
              active !== null ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {EXAMPLE_EVENTS.map((ev, i) => (
              <Image
                key={ev.id}
                src={ev.image}
                alt=""
                fill
                sizes="280px"
                className={`object-cover transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}
              />
            ))}
            <span className="label absolute bottom-3 left-3 text-[9px] text-ivory/70">Imagen provisional</span>
          </div>
        </div>
      </div>
    </section>
  );
}
