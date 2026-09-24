"use client";

import { useEffect, useState } from "react";
import { NAV } from "../_lib/content";

export function Header({ logo }: { logo: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 40);
      const probe = 36;
      let overLight = false;
      document.querySelectorAll<HTMLElement>("[data-tone='light']").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) overLight = true;
      });
      setLight(overLight);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const tone = light && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500 ${
        tone
          ? "border-b border-night/10 bg-ivory/85 text-night backdrop-blur-md"
          : scrolled || open
            ? "border-b border-ivory/8 bg-night/80 text-ivory backdrop-blur-md"
            : "border-b border-transparent text-ivory"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-[var(--gutter)] md:h-[72px]">
        <a
          href="#inicio"
          aria-label="Lago Music — inicio"
          tabIndex={scrolled || open ? 0 : -1}
          className={`shrink-0 transition-opacity duration-700 ${scrolled || open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          {logo}
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="label opacity-70 transition-opacity hover:opacity-100">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <a
            href="#produce"
            className={`label hidden border px-4 py-2.5 transition-colors sm:inline-block ${
              tone
                ? "border-night/30 hover:bg-night hover:text-ivory"
                : "border-gold/40 text-gold hover:bg-gold hover:text-night"
            }`}
          >
            Produce con Lago
          </a>
          <button
            type="button"
            className="label flex items-center gap-2 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-2.5 w-5">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
              />
            </span>
            {open ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto bg-night px-[var(--gutter)] pb-10 pt-8 lg:hidden"
      >
        <nav aria-label="Menú móvil" className="flex flex-col">
          {[...NAV, { href: "#produce", label: "Produce con Lago" }].map((n, i) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={`display border-b border-ivory/10 py-4 text-[13vw] leading-none sm:text-6xl ${
                n.href === "#produce" ? "text-gold" : ""
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <p className="label mt-10 text-smoke">Jalisco · México</p>
      </div>
    </header>
  );
}
