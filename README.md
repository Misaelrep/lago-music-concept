# Lago Music — prototipo conceptual V1

Prototipo de presentación para Lago Music (Jalisco, México). Todo el contenido es demostrativo: fechas demo, recintos por confirmar, sin métricas ni datos reales. Banda Torera del Valle es el único proyecto real mencionado.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run start
```

## Estructura de la página

| Velocidad | Secciones |
|---|---|
| Impacto | Hero · Próximos eventos · Archivo de flyers |
| Pausa | Manifiesto |
| Exploración | Calendario · Artistas · Shop |
| Transición | La Señal se aplana hasta quedar recta; corte negro → marfil |
| Conversión | Produce con Lago (conversacional) · Radar de demanda |

## Sistema

- **Señal Lago** — `app/_lib/signal.ts` (geometría) y `app/_components/Signal.tsx`. En el hero, `HeroSignal.tsx` usa una máscara SVG para "activar" la fotografía a lo largo de la línea.
- **Paleta** — tokens en `app/globals.css`: carbón, grafito cálido, bronce, champagne y marfil.
- **Tipografía** — Antonio (fechas, programación, títulos), Instrument Sans (interfaz), Instrument Serif (narrativa puntual).
- **Retícula hexagonal** — `Hex.tsx`, referencia a la rejilla del logo; sólo como textura mínima, marcadores, perforación de boleto y borde de transición.
- `prefers-reduced-motion`: la Señal queda estática, sin parallax ni apariciones.

## Logotipo oficial

El logo no se redibuja. Colocar el archivo oficial en `public/brand/` con uno de estos nombres y se usará automáticamente en cabecera, hero y pie:

```
public/brand/lago-music-logo.svg   (preferido)
public/brand/lago-music-logo.png   (fondo transparente)
public/brand/lago-music-logo.webp
```

Mientras no exista, se muestra un marcador de texto neutro ("Lago Music · logo oficial pendiente").

## Imágenes provisionales

`public/images/*.jpg` son escenas generadas proceduralmente (luz, humo, estructuras, siluetas) con un único gradiente de color para mantener una familia visual coherente. Son sustitutos temporales: reemplazar por fotografía real con los mismos nombres de archivo.
