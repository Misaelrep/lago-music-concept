"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCE_STEPS } from "../_lib/content";

type Answers = Record<string, string>;
type Contact = { nombre: string; medio: string };

const TOTAL = PRODUCE_STEPS.length;

function summary(a: Answers, c: Contact) {
  const tipo = (a.tipo ?? "un proyecto").toLowerCase();
  const parts = [`Quieres producir ${tipo === "otra idea" ? "una idea propia" : /^(gira|activación)/.test(tipo) ? `una ${tipo}` : `un ${tipo}`}`];
  if (a.lugar) parts.push(`en ${a.lugar}`);
  if (a.cuando) parts.push(a.cuando === "Aún no lo sé" ? "sin fecha definida todavía" : `en un horizonte de ${a.cuando.toLowerCase()}`);
  let s = parts.join(", ") + ".";
  if (a.aforo) s += a.aforo === "Aún no lo sé" ? " El aforo está por definirse." : ` Esperas ${a.aforo.toLowerCase()} personas.`;
  if (a.presupuesto) s += ` Presupuesto: ${a.presupuesto.toLowerCase()}.`;
  if (a.idea) s += ` La idea: “${a.idea}”.`;
  if (c.nombre) s += ` Te contactaríamos a ti, ${c.nombre}.`;
  return s;
}

export function Produce() {
  const [step, setStep] = useState(0); // TOTAL = resumen, TOTAL + 1 = enviado
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<Contact>({ nombre: "", medio: "" });
  const [draft, setDraft] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const current = PRODUCE_STEPS[step];

  const go = (to: number) => {
    const s = PRODUCE_STEPS[to];
    setDraft(s && s.kind === "text" ? (answers[s.id] ?? "") : "");
    setStep(to);
  };

  const answer = (value: string) => {
    setAnswers((a) => ({ ...a, [current.id]: value }));
    const next = step + 1;
    const s = PRODUCE_STEPS[next];
    setDraft(s && s.kind === "text" ? (answers[s.id] ?? "") : "");
    setStep(next);
  };

  const contactOk = contact.nombre.trim().length > 1 && contact.medio.trim().length > 4;

  return (
    <section
      id="produce"
      data-tone="light"
      aria-labelledby="produce-title"
      className="relative bg-ivory text-night"
    >
      <div className="grid gap-14 px-[var(--gutter)] pb-24 pt-28 md:grid-cols-12 md:gap-6 md:pb-36 md:pt-40">
        <div className="md:col-span-5">
          <p className="label text-bronze-deep">Producción</p>
          <h2 id="produce-title" className="display mt-6 whitespace-nowrap text-[clamp(3.6rem,8.2vw,8.6rem)] font-bold leading-[0.84]">
            Produce
            <br />
            con Lago.
          </h2>
          <p className="serif mt-8 max-w-sm text-xl italic leading-snug text-night/70 md:text-2xl">
            Una conversación, una pregunta a la vez. Sin formularios largos.
          </p>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          {/* Progreso: la Señal ya es una línea recta; cada respuesta, un nodo */}
          <div className="flex items-center gap-4" aria-hidden="true">
            <div className="relative h-4 flex-1">
              <div className="absolute inset-x-0 top-1/2 h-px bg-night/15" />
              <div
                className="absolute left-0 top-1/2 h-px bg-bronze-deep transition-[width] duration-700 ease-[var(--ease-out)]"
                style={{ width: `${(Math.min(step, TOTAL) / TOTAL) * 100}%` }}
              />
              {PRODUCE_STEPS.map((s, i) => (
                <svg
                  key={s.id}
                  viewBox="0 0 10 11.5"
                  className="absolute top-1/2 w-2.5 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(i / TOTAL) * 100}%` }}
                >
                  <polygon
                    points="5,0 10,2.9 10,8.6 5,11.5 0,8.6 0,2.9"
                    fill={i < step ? "var(--bronze-deep)" : "var(--ivory)"}
                    stroke={i <= step ? "var(--bronze-deep)" : "rgba(20,15,12,.3)"}
                  />
                </svg>
              ))}
            </div>
            <p className="label tabular text-night/50">
              {step < TOTAL ? `${String(step + 1).padStart(2, "0")} / ${String(TOTAL).padStart(2, "0")}` : "Resumen"}
            </p>
          </div>

          {/* Respuestas anteriores */}
          {step > 0 && step <= TOTAL && (
            <ol className="mt-6 flex flex-wrap gap-2" aria-label="Tus respuestas">
              {PRODUCE_STEPS.slice(0, step).map((s, i) => {
                const v = s.kind === "contact" ? contact.nombre : answers[s.id];
                if (!v) return null;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      className="label max-w-[16rem] truncate border border-night/20 px-3 py-1.5 !tracking-[0.12em] text-night/70 transition-colors hover:border-night hover:text-night"
                      aria-label={`Editar: ${s.question} ${v}`}
                    >
                      {v}
                    </button>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-12 min-h-[26rem]" aria-live="polite">
            {step < TOTAL && current && (
              <div key={current.id} className="step-in">
                <h3 ref={heading} tabIndex={-1} className="serif text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[1.02] outline-none">
                  {current.question}
                </h3>

                {current.kind === "choice" && (
                  <ul className="mt-10 border-t border-night/15">
                    {current.options.map((o) => {
                      const chosen = answers[current.id] === o;
                      return (
                        <li key={o}>
                          <button
                            type="button"
                            onClick={() => answer(o)}
                            className="group flex w-full items-center justify-between border-b border-night/15 py-4 text-left text-lg transition-colors hover:text-bronze-deep md:text-xl"
                          >
                            <span className="flex items-center gap-4">
                              <svg viewBox="0 0 10 11.5" className="w-2.5 shrink-0" aria-hidden="true">
                                <polygon
                                  points="5,0 10,2.9 10,8.6 5,11.5 0,8.6 0,2.9"
                                  className={`transition-colors ${chosen ? "fill-bronze-deep" : "fill-transparent group-hover:fill-bronze-deep"}`}
                                  stroke="currentColor"
                                />
                              </svg>
                              {o}
                            </span>
                            <span aria-hidden="true" className="translate-x-[-6px] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                              →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {current.kind === "text" && (
                  <form
                    className="mt-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (draft.trim()) answer(draft.trim());
                    }}
                  >
                    <label htmlFor={`f-${current.id}`} className="sr-only">
                      {current.question}
                    </label>
                    <input
                      id={`f-${current.id}`}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={current.placeholder}
                      autoComplete="off"
                      className="serif w-full border-b border-night/30 bg-transparent pb-3 text-2xl italic placeholder:text-night/30 focus:border-bronze-deep focus:outline-none md:text-3xl"
                    />
                    <div className="mt-8 flex items-center gap-6">
                      <button
                        type="submit"
                        disabled={!draft.trim()}
                        className="label bg-night px-6 py-3.5 text-ivory transition-opacity disabled:opacity-25"
                      >
                        Continuar →
                      </button>
                      <span className="label hidden text-night/40 sm:inline">o presiona Enter</span>
                    </div>
                  </form>
                )}

                {current.kind === "contact" && (
                  <form
                    className="mt-10 space-y-8"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (contactOk) go(TOTAL);
                    }}
                  >
                    <div>
                      <label htmlFor="f-nombre" className="label text-night/50">
                        Tu nombre
                      </label>
                      <input
                        id="f-nombre"
                        value={contact.nombre}
                        onChange={(e) => setContact((c) => ({ ...c, nombre: e.target.value }))}
                        autoComplete="name"
                        className="serif mt-2 w-full border-b border-night/30 bg-transparent pb-3 text-2xl italic focus:border-bronze-deep focus:outline-none md:text-3xl"
                      />
                    </div>
                    <div>
                      <label htmlFor="f-medio" className="label text-night/50">
                        Correo o WhatsApp
                      </label>
                      <input
                        id="f-medio"
                        value={contact.medio}
                        onChange={(e) => setContact((c) => ({ ...c, medio: e.target.value }))}
                        autoComplete="email"
                        className="serif mt-2 w-full border-b border-night/30 bg-transparent pb-3 text-2xl italic focus:border-bronze-deep focus:outline-none md:text-3xl"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!contactOk}
                      className="label bg-night px-6 py-3.5 text-ivory transition-opacity disabled:opacity-25"
                    >
                      Revisar →
                    </button>
                  </form>
                )}

                {step > 0 && (
                  <button type="button" onClick={() => go(step - 1)} className="label mt-10 text-night/50 hover:text-night">
                    ← Anterior
                  </button>
                )}
              </div>
            )}

            {step === TOTAL && (
              <div className="step-in">
                <h3 ref={heading} tabIndex={-1} className="label text-bronze-deep outline-none">
                  Esto es lo que entendimos
                </h3>
                <p className="serif mt-6 text-[clamp(1.7rem,3.2vw,2.6rem)] leading-[1.12]">{summary(answers, contact)}</p>
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <button type="button" onClick={() => go(TOTAL + 1)} className="label bg-night px-6 py-3.5 text-ivory">
                    Enviar a Lago →
                  </button>
                  <button type="button" onClick={() => go(0)} className="label text-night/50 hover:text-night">
                    Ajustar respuestas
                  </button>
                </div>
              </div>
            )}

            {step === TOTAL + 1 && (
              <div className="step-in">
                <h3 ref={heading} tabIndex={-1} className="display text-[clamp(3rem,6vw,5rem)] font-bold leading-[0.85] outline-none">
                  Señal
                  <br />
                  recibida.
                </h3>
                <p className="serif mt-6 max-w-md text-xl italic leading-snug text-night/70">
                  En la versión final, el equipo de Lago continuaría esta conversación contigo.
                </p>
                <p className="label mt-8 text-night/40">Prototipo · no se envió ningún dato</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
