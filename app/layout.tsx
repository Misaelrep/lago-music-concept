import type { Metadata, Viewport } from "next";
import { Antonio, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const antonio = Antonio({
  variable: "--font-antonio",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Lago Music — Eventos, música y cultura en vivo",
  description:
    "Prototipo conceptual V1 de Lago Music. Jalisco, México. Contenido e imágenes provisionales.",
};

export const viewport: Viewport = {
  themeColor: "#140f0c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${antonio.variable} ${instrumentSans.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
