import { NAV, REGION } from "../_lib/content";
import { HexField } from "./Hex";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-carbon pb-10 pt-20 md:pt-28">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 [mask-image:linear-gradient(to_top,black,transparent)]">
        <HexField size={14} opacity={0.07} />
      </div>
      <div className="relative grid gap-12 px-[var(--gutter)] md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <Logo width="clamp(140px, 14vw, 200px)" />
          <p className="label mt-6 text-ivory/60">{REGION}</p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-3 md:col-span-4 md:col-start-6">
          {[...NAV, { href: "#produce", label: "Produce con Lago" }, { href: "#radar", label: "Radar" }].map((n) => (
            <a key={n.href} href={n.href} className="label text-ivory/60 transition-colors hover:text-gold">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="md:col-span-3 md:col-start-10 md:text-right">
          <a href="#produce" className="link-line label text-gold">
            Produce con Lago <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <div className="relative mt-20 flex flex-col gap-2 border-t border-ivory/10 px-[var(--gutter)] pt-6 md:flex-row md:justify-between">
        <p className="label text-ivory/35">Prototipo conceptual · V1</p>
        <p className="label text-ivory/35">Contenido, fechas e imágenes provisionales</p>
      </div>
    </footer>
  );
}
