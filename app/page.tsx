import { Archive } from "./_components/Archive";
import { Events } from "./_components/Events";
import { Artists, Manifesto, Shop } from "./_components/Exploration";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { Hero } from "./_components/Hero";
import { Logo } from "./_components/Logo";
import { Produce } from "./_components/Produce";
import { Radar } from "./_components/Radar";
import { Transition } from "./_components/Transition";

export default function Home() {
  return (
    <>
      <a
        href="#archivo"
        className="label sr-only z-[60] bg-gold px-4 py-3 text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header logo={<Logo width="120px" compact />} />
      <main>
        {/* IMPACTO */}
        <Hero />
        <Archive />
        <Events />

        {/* pausa */}
        <Manifesto />

        {/* EXPLORACIÓN */}
        <Artists />
        <Shop />

        {/* la Señal se aquieta */}
        <Transition />

        {/* CONVERSIÓN */}
        <Produce />
        <Radar />
      </main>
      <Footer />
    </>
  );
}
