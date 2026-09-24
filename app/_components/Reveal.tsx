"use client";

import { useRef } from "react";
import { useInView } from "../_lib/motion";

/** Aparición sobria al entrar en pantalla (una sola vez). */
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "figure";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { rootMargin: "0px 0px -8% 0px", once: true });
  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-visible={visible}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
