"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EVENTS } from "../_lib/content";
import { HexMark } from "./Hex";
import { Reveal } from "./Reveal";
import { Signal } from "./Signal";

function TicketButton({ tone = "gold" }: { tone?: "gold" | "line" }) {
  const [asked, setAsked] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setAsked(true)}
      className={`label inline-flex min-w-[9.5rem] items-center justify-between gap-3 px-4 py-3 transition-colors ${
        tone === "gold"
          ? "bg-gold text-night hover:bg-ivory"
          : "border border-ivory/25 hover:border-gold hover:text-gold"
      }`}
    >
      <span aria-live="polite">{asked ? "Próximamente" : "Tickets"}</span>
      <span aria-hidden="true">→</span>
    </button>
  );
}

export function Events() {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [featured, ...rest] = EVENTS;

  const onMove = (e: React.PointerEvent) => {
    const list = listRef.current;
    const prev = previewRef.current;
    if (!list || !prev || e.pointerType === "touch") return;
    const r = list.getBoundingClientRect();
    prev.style.setProperty("--x", `${e.clientX - r.left}px`);
    prev.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section id="eventos" aria-labelledby="eventos-title" className="relative bg-night pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="px-[var(--gutter)]">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="label text-gold md:col-span-3">Programación</p>
          <h2 id="eventos-title" className="display text-[clamp(3.2rem,9vw,8.5rem)] font-semibold md:col-span-6">
            Próximos
            <br />
            eventos
          </h2>
          <p className="label text-ivory/50 md:col-span-3 md:text-right">
            Fechas y recintos
            <br className="hidden md:block" /> demostrativos
          </p>
        </Reveal>
      </div>

      {/* La Señal se estira y se vuelve línea de tiempo: cada evento es un nodo */}
      <div className="mt-14 h-28 md:mt-20 md:h-36">
        <Signal
          options={{ from: 0.5, to: 0.5, amplitude: 0.22, frequency: 0.9, phase: 2 }}
          nodes={EVENTS.map((_, i) => ({ u: 0.16 + i * 0.22 }))}
          activeNode={active ?? 0}
          interactive
        />
      </div>

      {/* Evento destacado */}
      <article
        id={featured.id}
        className="mt-10 grid gap-8 px-[var(--gutter)] md:mt-16 md:grid-cols-12 md:gap-6"
        onPointerEnter={() => setActive(0)}
      >
        <Reveal className="md:col-span-7 md:pr-8">
          <div className="flex items-center gap-4">
            <HexMark className="h-10 w-9 text-gold">
              <span className="label !tracking-normal">{featured.marker}</span>
            </HexMark>
            <p className="label text-ivory/60">Concepto {featured.marker} · Fecha demo</p>
          </div>
          <div className="mt-6 flex items-end gap-6">
            <p className="display tabular text-[clamp(8rem,24vw,21rem)] font-bold leading-[0.74] text-ivory">
              {featured.day}
            </p>
            <div className="pb-3">
              <p className="display text-[clamp(2.4rem,5vw,4.5rem)] text-gold">{featured.month}</p>
              <p className="label mt-3 text-ivory/60">
                {featured.weekday} · {featured.year}
              </p>
            </div>
          </div>
          <div className="mt-10 border-t border-ivory/15 pt-6">
            <p className="label text-gold">
              {featured.kicker} · {featured.format}
            </p>
            <h3 className="display mt-3 text-[clamp(2.6rem,6vw,5.4rem)] font-semibold">{featured.title}</h3>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
              <p className="label text-ivory/60">{featured.venue} · Jalisco</p>
              <TicketButton />
            </div>
          </div>
        </Reveal>
        <Reveal className="md:col-span-5" delay={120}>
          <div className="grain relative aspect-[4/5] overflow-hidden bg-graphite">
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-out)] hover:scale-[1.03]"
            />
          </div>
          <p className="label mt-3 text-ivory/35">Imagen provisional</p>
        </Reveal>
      </article>

      {/* Programa */}
      <div
        ref={listRef}
        className="group/list relative mt-24 px-[var(--gutter)] md:mt-32"
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
      >
        <p className="label mb-6 text-ivory/50">Después</p>
        <ul className="border-t border-ivory/15">
          {rest.map((ev, idx) => {
            const i = idx + 1;
            const dim = active !== null && active !== i && active !== 0;
            return (
              <li
                key={ev.id}
                id={ev.id}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={`relative border-b border-ivory/15 transition-opacity duration-500 ${dim ? "opacity-35" : "opacity-100"}`}
              >
                <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 py-7 md:grid-cols-12 md:gap-6 md:py-9">
                  <HexMark className="h-9 w-8 text-gold/80 md:col-span-1 md:h-10 md:w-9">
                    <span className="label !tracking-normal">{ev.marker}</span>
                  </HexMark>
                  <p className="display tabular flex items-baseline gap-3 text-5xl font-semibold md:col-span-2 md:text-7xl">
                    {ev.day}
                    <span className="text-2xl text-gold md:text-3xl">{ev.month}</span>
                  </p>
                  <div className="col-span-2 md:col-span-5">
                    <p className="label text-gold/90">{ev.kicker}</p>
                    <h3 className="display mt-2 text-4xl font-semibold md:text-5xl">{ev.title}</h3>
                    <p className="label mt-3 text-ivory/50">{ev.format}</p>
                  </div>
                  <div className="relative col-span-2 aspect-[16/10] overflow-hidden md:hidden">
                    <Image src={ev.image} alt={ev.imageAlt} fill sizes="100vw" className="object-cover" />
                  </div>
                  <p className="label col-span-2 text-ivory/60 md:col-span-2">
                    {ev.weekday} · {ev.year}
                    <br />
                    {ev.venue}
                  </p>
                  <div className="col-span-2 md:col-span-2 md:justify-self-end">
                    <TicketButton tone="line" />
                  </div>
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
            className={`relative aspect-[4/5] w-[min(24vw,340px)] -translate-y-1/2 overflow-hidden transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
              active && active > 0 ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {rest.map((ev, idx) => (
              <Image
                key={ev.id}
                src={ev.image}
                alt=""
                fill
                sizes="340px"
                className={`object-cover transition-opacity duration-500 ${active === idx + 1 ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
