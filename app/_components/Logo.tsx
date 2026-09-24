import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

// El logotipo oficial se usa tal cual, nunca redibujado.
// Colocar el archivo en /public/brand/ con alguno de estos nombres.
const CANDIDATES = ["lago-music-logo.svg", "lago-music-logo.png", "lago-music-logo.webp"];

function findLogo() {
  for (const name of CANDIDATES) {
    const file = path.join(process.cwd(), "public", "brand", name);
    if (fs.existsSync(file)) return `/brand/${name}`;
  }
  return null;
}

/** Dimensiones intrínsecas del PNG/WebP (para next/image). */
function readSize(src: string): { width: number; height: number } {
  const file = path.join(process.cwd(), "public", src);
  const buf = fs.readFileSync(file);
  if (src.endsWith(".png") && buf.length > 24) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (src.endsWith(".webp") && buf.toString("ascii", 12, 16) === "VP8X") {
    return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
  }
  return { width: 1200, height: 600 };
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
  const src = findLogo();

  if (!src) {
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

  const { width: w, height: h } = src.endsWith(".svg") ? { width: 1200, height: 600 } : readSize(src);
  return (
    <Image
      src={src}
      alt="Lago Music"
      width={w}
      height={h}
      preload={preload}
      unoptimized={src.endsWith(".svg")}
      className={`h-auto ${className}`}
      style={{ width }}
    />
  );
}
