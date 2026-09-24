// Retícula hexagonal: referencia al patrimonio del logo (rejilla de bocina).
// Se usa sólo como textura mínima, máscara o detalle — nunca como fondo dominante.

type HexFieldProps = {
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
};

/** Textura hexagonal para cubrir un área, con opacidad mínima. */
export function HexField({ className = "", size = 22, opacity = 0.06, color = "var(--gold)" }: HexFieldProps) {
  const w = Math.sqrt(3) * size;
  const h = size * 3;
  const id = `hex-${size}-${String(opacity).replace(".", "")}`;
  // Dos hexágonos por celda (fila par e impar).
  const hex = (cx: number, cy: number) => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      pts.push(`${(cx + size * Math.cos(a)).toFixed(2)},${(cy + size * Math.sin(a)).toFixed(2)}`);
    }
    return pts.join(" ");
  };
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width={w} height={h} patternUnits="userSpaceOnUse">
          <polygon points={hex(w / 2, size)} fill="none" stroke={color} strokeWidth="0.75" />
          <polygon points={hex(0, size * 2.5)} fill="none" stroke={color} strokeWidth="0.75" />
          <polygon points={hex(w, size * 2.5)} fill="none" stroke={color} strokeWidth="0.75" />
          <polygon points={hex(0, -size * 0.5)} fill="none" stroke={color} strokeWidth="0.75" />
          <polygon points={hex(w, -size * 0.5)} fill="none" stroke={color} strokeWidth="0.75" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} opacity={opacity} />
    </svg>
  );
}

/** Hexágono aislado (marcadores, nodos, perforaciones). */
export function HexMark({
  className = "",
  filled = false,
  children,
}: {
  className?: string;
  filled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <span className={`relative inline-grid place-items-center ${className}`}>
      <svg viewBox="0 0 40 46" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <polygon
          points="20,1 39,12 39,34 20,45 1,34 1,12"
          fill={filled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
