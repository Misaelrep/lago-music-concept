import Image from "next/image";
import { EVENTS, REGION } from "../_lib/content";
import { HeroSignal } from "./HeroSignal";
import { HexField, HexMark } from "./Hex";
import { Logo } from "./Logo";

const HERO_IMAGE = "/images/hero-stage.jpg";

export function Hero() {
  const next = EVENTS[0];
  return (
    <section
      id="inicio"
      aria-label="Lago Music"
      className="grain relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-carbon"
    >
      {/* Fotografía base, apagada */}
      <Image
        src={HERO_IMAGE}
        alt="Escenario iluminado por haces de luz desde el truss, con el público en primer plano."
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
        style={{ filter: "brightness(.72) saturate(.9)" }}
      />

      {/* La Señal activa la escena */}
      <HeroSignal src={HERO_IMAGE} />

      {/* Lectura: sombras editoriales */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(14,10,8,.72)_0%,rgba(14,10,8,0)_32%,rgba(14,10,8,0)_52%,rgba(14,10,8,.94)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(14,10,8,.55)_0%,rgba(14,10,8,0)_45%)]" />
      <div className="pointer-events-none absolute right-0 top-0 h-1/2 w-1/2 [mask-image:radial-gradient(closest-side_at_85%_20%,black,transparent)]">
        <HexField size={18} opacity={0.12} />
      </div>

      {/* Marca */}
      <div className="relative z-10 px-[var(--gutter)] pt-24 md:pt-28">
        <Logo width="clamp(150px, 16vw, 240px)" preload />
        <div className="mt-6 flex flex-col gap-1.5 md:mt-8">
          <p className="label text-ivory">{REGION}</p>
          <p className="label text-ivory/60">Eventos / Música / Cultura en vivo</p>
        </div>
      </div>

      {/* Programación */}
      <div className="relative z-10 mt-auto grid gap-8 px-[var(--gutter)] pb-8 md:grid-cols-12 md:items-end md:pb-12">
        <div className="order-2 md:order-1 md:col-span-5">
          <a href="#produce" className="link-line label text-gold">
            Produce con Lago <span className="arrow" aria-hidden="true">→</span>
          </a>
          <p className="serif mt-4 hidden max-w-xs text-lg italic leading-snug text-ivory/60 md:block">
            Conciertos, festivales y experiencias en vivo — de la idea al escenario.
          </p>
        </div>

        <article
          aria-label="Próximo evento"
          className="order-1 border-t border-gold/40 pt-5 md:order-2 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8"
        >
          <div className="flex items-center justify-between">
            <p className="label text-gold">Próximo evento</p>
            <p className="label text-ivory/50">Fecha demo</p>
          </div>
          <div className="mt-4 flex items-end gap-5 md:gap-7">
            <p className="display tabular text-[clamp(5.5rem,13vw,11rem)] font-semibold leading-[0.78] text-ivory">
              {next.day}
            </p>
            <div className="pb-1.5">
              <p className="display text-[clamp(1.6rem,3vw,2.6rem)] text-gold">{next.month}</p>
              <p className="label mt-2 text-ivory/60">
                {next.weekday} · {next.year}
              </p>
            </div>
            <HexMark className="ml-auto mb-2 h-10 w-9 text-gold/70">
              <span className="label !tracking-normal">{next.marker}</span>
            </HexMark>
          </div>
          <h2 className="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)] font-semibold">{next.title}</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
            <p className="label text-ivory/60">
              {next.venue} · Jalisco
            </p>
            <a
              href={`#${next.id}`}
              className="label inline-flex items-center gap-3 bg-gold px-5 py-3 text-night transition-colors hover:bg-ivory"
            >
              Ver evento <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
