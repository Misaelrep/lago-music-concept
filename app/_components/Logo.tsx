import Image from "next/image";
import { readAsset } from "../_lib/assets";

// El logotipo oficial se usa tal cual, nunca redibujado.
// Colocar el archivo en /public/brand/ con alguno de estos nombres.
const CANDIDATES = ["/brand/lago-music-logo.png", "/brand/lago-music-logo.webp"];

function findLogo() {
  for (const src of CANDIDATES) {
    const asset = readAsset(src);
    if (asset) return asset;
  }
  return null;
}

type Props = {
  className?: string;
  /** Ancho CSS del logotipo; la altura se deriva de sus proporciones. */
  width: string;
  preload?: boolean;
  /** Sin la nota de 'pendiente' (cabecera). */
  compact?: boolean;
};

export function Logo({ className = "", width, preload = false, compact = false }: Props) {
  const logo = findLogo();

  if (!logo) {
    // Marcador temporal mientras llega el archivo oficial: texto neutro,
    // deliberadamente sin intentar imitar el logotipo.
    return (
      <span
        className={`inline-flex flex-col leading-none ${className}`}
        style={{ width }}
        aria-label="Lago Music"
      >
        <span className="label whitespace-nowrap !tracking-[0.42em]">Lago Music</span>
        {!compact && (
          <span className="mt-1.5 whitespace-nowrap text-[9px] uppercase tracking-[0.2em] opacity-50">
            Logo oficial pendiente
          </span>
        )}
      </span>
    );
  }

  return (
    <Image
      src={logo.src}
      alt="Lago Music"
      width={logo.width}
      height={logo.height}
      preload={preload}
      quality={90}
      sizes={`(min-width: 768px) 260px, 200px`}
      className={`h-auto ${className}`}
      style={{ width }}
    />
  );
}
