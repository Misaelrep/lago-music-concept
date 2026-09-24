"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

/** true mientras el elemento está (aprox.) en pantalla. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "0px", once = false }: { rootMargin?: string; once?: boolean } = {},
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) io.disconnect();
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, once]);
  return inView;
}

/** Bucle rAF que sólo corre mientras `active` es true. Recibe segundos. */
export function useFrame(callback: (time: number) => void, active: boolean) {
  const cb = useRef(callback);
  useEffect(() => {
    cb.current = callback;
  });
  useEffect(() => {
    if (!active) return;
    let id = 0;
    const loop = (now: number) => {
      cb.current(now / 1000);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/**
 * Progreso de scroll 0→1 de un elemento: 0 cuando su borde superior toca
 * el borde inferior del viewport, 1 cuando su borde inferior toca el superior.
 */
export function scrollProgress(el: Element) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = r.height + vh;
  return Math.min(1, Math.max(0, (vh - r.top) / total));
}
