import { ARCHIVE } from "../_lib/content";
import { readAsset } from "../_lib/assets";
import { ArchiveWall, type ArchivePiece } from "./ArchiveWall";
import { Reveal } from "./Reveal";

/** Archivo Lago: eventos pasados reales (servidor: lee los flyers disponibles). */
export function Archive() {
  const pieces: ArchivePiece[] = ARCHIVE.map((e) => ({
    ...e,
    asset: e.flyer ? readAsset(e.flyer) : null,
  }));
  const years = ARCHIVE.map((e) => e.year);
  const first = Math.min(...years);
  const last = Math.max(...years);

  return (
    <section id="archivo" aria-labelledby="archivo-title" className="relative overflow-hidden bg-carbon py-24 md:py-36">
      <div className="px-[var(--gutter)]">
        <Reveal className="grid gap-6 md:grid-cols-12 md:items-end">
          <p className="label text-gold md:col-span-3">
            Eventos pasados · {first}—{last}
          </p>
          <h2 id="archivo-title" className="display text-[clamp(3.2rem,9vw,8.5rem)] font-semibold md:col-span-6">
            Archivo
            <br />
            Lago
          </h2>
          <p className="serif text-lg italic leading-snug text-ivory/70 md:col-span-3 md:text-xl">
            Ferias, carnavales y eventos con causa en Jalisco.
          </p>
        </Reveal>
      </div>

      {/* La Señal, ya recta, como eje de años */}
      <nav aria-label="Años del archivo" className="mt-16 px-[var(--gutter)] md:mt-24">
        <div className="relative">
          <div className="absolute inset-x-0 top-[9px] h-px bg-gradient-to-r from-bronze/0 via-gold/70 to-bronze/0" />
          <ol className="relative flex justify-between">
            {Array.from({ length: last - first + 1 }, (_, i) => first + i).map((y) => {
              const entry = ARCHIVE.find((e) => e.year === y);
              return (
                <li key={y} className="flex flex-col items-center">
                  {entry ? (
                    <a href={`#${entry.id}`} className="group flex flex-col items-center" aria-label={`${y}: ${entry.title}`}>
                      <svg viewBox="0 0 16 18" className="h-[18px] w-4 text-gold" aria-hidden="true">
                        <polygon points="8,0.5 15.5,4.75 15.5,13.25 8,17.5 0.5,13.25 0.5,4.75" fill="var(--carbon)" stroke="currentColor" className="transition-colors group-hover:fill-[var(--gold)]" />
                      </svg>
                      <span className="display mt-3 text-2xl text-ivory transition-colors group-hover:text-gold md:text-3xl">{y}</span>
                    </a>
                  ) : (
                    <>
                      <span className="mt-[5px] block h-2 w-px bg-ivory/30" aria-hidden="true" />
                      <span className="display mt-[18px] text-2xl text-ivory/20 md:text-3xl">{y}</span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>

      <ArchiveWall pieces={pieces} />

      <p className="label mt-16 px-[var(--gutter)] text-ivory/40">Archivo en construcción · se irán sumando piezas</p>
    </section>
  );
}
