"use client";

import { useState } from "react";
import { hexPoints } from "./Signal";

type Sent = { id: number; ciudad: string; que: string };

/**
 * Radar de demanda: el público envía una señal (ciudad + artista/género).
 * Sin votos ni resultados: sólo la propagación visual del concepto.
 */
export function Radar() {
  const [ciudad, setCiudad] = useState("");
  const [que, setQue] = useState("");
  const [sent, setSent] = useState<Sent | null>(null);

  const ok = ciudad.trim().length > 1 && que.trim().length > 1;

  return (
    <section
      id="radar"
      data-tone="light"
      aria-labelledby="radar-title"
      className="relative overflow-hidden border-t border-night/10 bg-ivory text-night"
    >
      <div className="grid gap-14 px-[var(--gutter)] py-24 md:grid-cols-12 md:gap-6 md:py-36">
        <div className="md:col-span-5">
          <p className="label text-bronze-deep">Radar de demanda</p>
          <h2 id="radar-title" className="display mt-6 text-[clamp(2.8rem,6.4vw,6rem)] font-bold leading-[1.04]">
            ¿Qué quieres
            <br />
            ver en vivo?
          </h2>
          <p className="serif mt-6 max-w-sm text-xl italic leading-snug text-night/70">
            Dinos dónde y qué. Cada señal ayuda a imaginar la próxima programación.
          </p>

          <form
            className="mt-12 space-y-8"
            onSubmit={(e) => {
              e.preventDefault();
              if (!ok) return;
              setSent({ id: Date.now(), ciudad: ciudad.trim(), que: que.trim() });
            }}
          >
            <div>
              <label htmlFor="r-ciudad" className="label text-night/50">
                Ciudad
              </label>
              <input
                id="r-ciudad"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                autoComplete="address-level2"
                className="serif mt-2 w-full border-b border-night/30 bg-transparent pb-3 text-2xl italic focus:border-bronze-deep focus:outline-none md:text-3xl"
              />
            </div>
            <div>
              <label htmlFor="r-que" className="label text-night/50">
                Artista o género
              </label>
              <input
                id="r-que"
                value={que}
                onChange={(e) => setQue(e.target.value)}
                autoComplete="off"
                className="serif mt-2 w-full border-b border-night/30 bg-transparent pb-3 text-2xl italic focus:border-bronze-deep focus:outline-none md:text-3xl"
              />
            </div>
            <button
              type="submit"
              disabled={!ok}
              className="label inline-flex items-center gap-3 bg-night px-6 py-3.5 text-ivory transition-opacity disabled:opacity-25"
            >
              Enviar señal <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <div className="relative md:col-span-6 md:col-start-7">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <svg viewBox="-100 -100 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {/* retícula de referencia, estática */}
              {[30, 55, 80].map((r) => (
                <polygon key={r} points={hexPoints(0, 0, r)} fill="none" stroke="rgba(20,15,12,.12)" strokeWidth=".4" />
              ))}
              <line x1="-96" y1="0" x2="96" y2="0" stroke="rgba(20,15,12,.1)" strokeWidth=".3" />
              <line x1="0" y1="-96" x2="0" y2="96" stroke="rgba(20,15,12,.1)" strokeWidth=".3" />
              {/* propagación */}
              {sent &&
                [0, 1, 2, 3].map((i) => (
                  <polygon
                    key={`${sent.id}-${i}`}
                    className="ring"
                    style={{ animationDelay: `${i * 0.45}s`, scale: String(0.4 + i * 0.2) }}
                    points={hexPoints(0, 0, 95)}
                    fill="none"
                    stroke="var(--bronze-deep)"
                    strokeWidth=".6"
                  />
                ))}
              <polygon points={hexPoints(0, 0, 4)} fill={sent ? "var(--bronze-deep)" : "none"} stroke="var(--bronze-deep)" strokeWidth=".6" />
            </svg>
          </div>
          <div aria-live="polite" className="mt-6 min-h-24 text-center">
            {sent ? (
              <>
                <p className="serif text-2xl italic md:text-3xl">
                  “{sent.que}” · {sent.ciudad}
                </p>
                <p className="label mt-3 text-night/45">Señal enviada · prototipo: no se almacena</p>
              </>
            ) : (
              <p className="label text-night/40">Esperando señal</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
