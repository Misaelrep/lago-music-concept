"use client";

import { useState } from "react";
import { EVENTS } from "../_lib/content";
import { HexMark } from "./Hex";
import { Reveal } from "./Reveal";

const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const monthKeys = Array.from(new Set(EVENTS.map((e) => `${e.year}-${e.monthIndex}`))).map((k) => {
  const [y, m] = k.split("-").map(Number);
  return { year: y, month: m, days: new Date(y, m + 1, 0).getDate() };
});

export function Calendar() {
  const [sel, setSel] = useState(0);
  const cur = monthKeys[sel];
  const events = EVENTS.filter((e) => e.year === cur.year && e.monthIndex === cur.month);
  const eventDays = new Map(events.map((e) => [Number(e.day), e]));

  return (
    <section id="calendario" aria-labelledby="calendario-title" className="bg-night py-24 md:py-36">
      <div className="grid gap-12 px-[var(--gutter)] md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-4">
          <p className="label text-gold">Calendario</p>
          <h2 id="calendario-title" className="display mt-5 text-[clamp(2.8rem,6vw,5.5rem)] font-semibold">
            Temporada
          </h2>
          <p className="label mt-4 text-ivory/45">Fechas demo</p>

          <div role="tablist" aria-label="Meses" className="mt-10 flex gap-6 md:flex-col md:gap-4">
            {monthKeys.map((m, i) => (
              <button
                key={`${m.year}-${m.month}`}
                role="tab"
                id={`mes-${i}`}
                aria-selected={sel === i}
                aria-controls="calendario-panel"
                onClick={() => setSel(i)}
                className={`display text-left text-3xl leading-none transition-colors md:text-5xl ${
                  sel === i ? "text-ivory" : "text-ivory/25 hover:text-ivory/60"
                }`}
              >
                {MONTHS[m.month].slice(0, 3)}
                <span className="label ml-3 align-middle !text-[10px] text-ivory/40">{m.year}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <div id="calendario-panel" role="tabpanel" aria-labelledby={`mes-${sel}`} className="md:col-span-8">
          {/* La Señal, ya recta, se vuelve eje de fechas */}
          <div className="relative pb-10 pt-16" aria-hidden="true">
            <div className="absolute inset-x-0 top-16 h-px bg-gradient-to-r from-bronze/0 via-gold/80 to-bronze/0" />
            <div className="relative flex justify-between">
              {Array.from({ length: cur.days }, (_, i) => i + 1).map((d) => {
                const ev = eventDays.get(d);
                const major = d === 1 || d % 5 === 0;
                return (
                  <div key={d} className="relative flex w-0 flex-col items-center">
                    <span className={`block w-px ${ev ? "h-0" : major ? "h-3 bg-ivory/40" : "h-1.5 bg-ivory/20"}`} />
                    {ev && (
                      <HexMark filled className="absolute -top-[9px] h-[18px] w-[16px] text-gold" />
                    )}
                    <span
                      className={`label mt-4 !tracking-normal ${ev ? "text-gold" : major ? "text-ivory/40" : "hidden sm:block sm:text-ivory/15"}`}
                    >
                      {ev || major ? d : "·"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <ul className="border-t border-ivory/15">
            {events.map((e) => (
              <li key={e.id} className="grid grid-cols-[4.5rem_1fr_auto] items-baseline gap-4 border-b border-ivory/15 py-6">
                <p className="display tabular text-4xl font-semibold">{e.day}</p>
                <div>
                  <p className="display text-2xl font-semibold md:text-3xl">{e.title}</p>
                  <p className="label mt-2 text-ivory/50">
                    {e.kicker} · {e.venue}
                  </p>
                </div>
                <a href={`#${e.id}`} className="link-line label text-gold">
                  Ver <span className="arrow" aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
