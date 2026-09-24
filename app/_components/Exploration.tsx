import Image from "next/image";
import { wavePath } from "../_lib/signal";
import { HexField } from "./Hex";
import { Reveal } from "./Reveal";
import { Signal } from "./Signal";

/** Pausa: una sola frase, sin movimiento ambiental. */
export function Manifesto() {
  return (
    <section aria-label="Manifiesto" className="bg-night pb-10 pt-28 md:pt-44">
      <div className="px-[var(--gutter)]">
        <Reveal>
          <p className="serif max-w-[18ch] text-[clamp(2.2rem,5.4vw,5.2rem)] italic leading-[1.02] text-ivory/90">
            Antes del primer acorde hay una estructura, un equipo y una señal.
          </p>
        </Reveal>
      </div>
      <div className="mt-20 h-20 md:mt-28">
        <Signal animate={false} options={{ amplitude: 0.3, frequency: 0.8, phase: 1 }} />
      </div>
    </section>
  );
}

export function Artists() {
  return (
    <section id="artistas" aria-labelledby="artistas-title" className="relative overflow-hidden bg-graphite py-24 md:py-36">
      <div className="grid gap-12 px-[var(--gutter)] md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-3">
          <p className="label text-gold">Artistas</p>
          <p className="label mt-4 text-ivory/45">Roster en construcción</p>
        </Reveal>
        <Reveal className="md:col-span-9" delay={100}>
          <h2 id="artistas-title" className="display text-[clamp(3.4rem,10vw,10rem)] font-bold leading-[0.82]">
            Banda Torera
            <br />
            <span className="text-gold">del Valle</span>
          </h2>
          <div className="mt-10 grid gap-8 border-t border-ivory/15 pt-6 md:grid-cols-9 md:gap-6">
            <p className="serif text-xl italic leading-snug text-ivory/75 md:col-span-5 md:text-2xl">
              Único proyecto real presentado en este prototipo. Su espacio se completará con material oficial.
            </p>
            <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
              <p className="label text-ivory/50">Música en vivo · Jalisco</p>
              <span className="label text-ivory/35">Perfil completo · próximamente</span>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 [mask-image:radial-gradient(closest-side,black,transparent)]">
        <HexField size={16} opacity={0.14} />
      </div>
    </section>
  );
}

const printWave = wavePath(200, 60, 1.4, { from: 0.5, to: 0.5, amplitude: 0.32, frequency: 1.3, taper: true });

function TeeMock() {
  return (
    <svg viewBox="0 0 400 440" className="h-full w-full" aria-hidden="true">
      <path
        d="M140 40 C160 62 240 62 260 40 L340 72 L384 150 L330 178 L316 160 L316 410 L84 410 L84 160 L70 178 L16 150 L60 72 Z"
        fill="var(--carbon)"
        stroke="rgba(241,232,218,.12)"
      />
      <path d="M140 40 C160 62 240 62 260 40" fill="none" stroke="rgba(241,232,218,.18)" strokeWidth="3" />
      <g transform="translate(100 170)">
        <path d={printWave} fill="none" stroke="var(--gold)" strokeWidth="2" />
        <text x="100" y="98" textAnchor="middle" fill="var(--gold)" style={{ font: "600 13px var(--font-antonio)", letterSpacing: ".3em" }}>
          SEÑAL LAGO
        </text>
      </g>
    </svg>
  );
}

export function Shop() {
  const items = [
    {
      id: "camiseta",
      name: "Camiseta Señal",
      detail: "Algodón pesado · impresión en tinta dorada",
      art: (
        <div className="grid h-full place-items-center bg-graphite p-[12%]">
          <TeeMock />
        </div>
      ),
    },
    {
      id: "poster",
      name: "Póster de archivo",
      detail: "Serigrafía · edición numerada",
      art: (
        <div className="grid h-full place-items-center bg-graphite p-[14%]">
          <div className="relative aspect-[2/3] h-full border-[10px] border-ivory shadow-[0_30px_50px_-20px_rgba(0,0,0,.8)]">
            <Image src="/images/rig-lights.jpg" alt="" fill sizes="20vw" className="object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end p-[10%]">
              <p className="display text-[clamp(1.2rem,2.4vw,2rem)] font-bold leading-none text-ivory">Cultura<br />en vivo</p>
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <section id="shop" aria-labelledby="shop-title" className="bg-night py-24 md:py-36">
      <div className="grid gap-6 px-[var(--gutter)] md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-3">
          <p className="label text-gold">Shop</p>
        </Reveal>
        <Reveal className="md:col-span-9">
          <h2 id="shop-title" className="display text-[clamp(2.8rem,6vw,5.5rem)] font-semibold">
            Objetos de archivo
          </h2>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-10 px-[var(--gutter)] md:grid-cols-12 md:gap-6">
        {items.map((it, i) => (
          <Reveal key={it.id} className={i === 0 ? "md:col-span-5 md:col-start-4" : "md:col-span-4 md:mt-24"} delay={i * 120}>
            <div className="relative aspect-[4/5] overflow-hidden">
              {it.art}
              <span className="label absolute left-4 top-4 border border-gold/50 bg-night/70 px-3 py-2 text-gold backdrop-blur">
                Concepto / Próximamente
              </span>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-ivory/15 pt-4">
              <h3 className="display text-2xl font-semibold md:text-3xl">{it.name}</h3>
              <p className="label text-right text-ivory/45">{it.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
