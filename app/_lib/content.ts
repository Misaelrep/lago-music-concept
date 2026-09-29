// Contenido de Lago Music.
// ARCHIVE: eventos reales. Sólo datos proporcionados o visibles en los flyers.
// EXAMPLE_EVENTS: ejemplos de formato para la cartelera — no son fechas reales.
// Banda Torera del Valle es el único proyecto artístico real mencionado.

export const REGION = "Jalisco · México";

export type ArchiveEntry = {
  id: string;
  year: number;
  title: string;
  /** Flyer oficial en /public; si falta, la pieza se muestra como ficha textual. */
  flyer?: string;
  flyerAlt?: string;
  /** Texto de la ficha (sólo hechos proporcionados). */
  summary?: string;
  /** Datos breves: lugar, colaboración, rol. */
  facts?: string[];
};

export const ARCHIVE: ArchiveEntry[] = [
  {
    id: "expo-ganadera-jalisco-2025",
    year: 2025,
    title: "Expo Ganadera Jalisco",
    flyer: "/images/archivo/expo-ganadera-jalisco-2025.jpg",
    flyerAlt: "Flyer oficial de Expo Ganadera Jalisco 2025.",
  },
  {
    id: "carnaval-sayula-2024",
    year: 2024,
    title: "Carnaval Sayula",
    flyer: "/images/archivo/carnaval-sayula-2024.jpg",
    flyerAlt: "Flyer oficial de Carnaval Sayula 2024.",
  },
  {
    id: "feria-zapotlan-2022",
    year: 2022,
    title: "Feria Zapotlán",
    summary:
      "Lago Music participó en la organización y promoción vinculada a la programación musical de la Feria Zapotlán 2022.",
    facts: ["Organización y promoción", "Programación musical"],
  },
  {
    id: "dif-zapotlan-2020",
    year: 2020,
    title: "Evento DIF Zapotlán",
    summary:
      "Evento con causa realizado en colaboración con DIF Zapotlán y Lago Music en el Lienzo Charro de Ciudad Guzmán.",
    facts: ["Evento con causa", "Lienzo Charro · Ciudad Guzmán"],
  },
];

export type ExampleEvent = {
  id: string;
  marker: string;
  title: string;
  kicker: string;
  format: string;
  image: string;
  imageAlt: string;
};

/** Ejemplos de formato de cartelera. Se sustituirán por los flyers actuales. */
export const EXAMPLE_EVENTS: ExampleEvent[] = [
  {
    id: "ejemplo-a",
    marker: "A",
    title: "Concierto",
    kicker: "Ejemplo de formato",
    format: "Artista · recinto · boletos",
    image: "/images/crowd-wash.jpg",
    imageAlt: "Imagen provisional: público a contraluz frente a un escenario iluminado.",
  },
  {
    id: "ejemplo-b",
    marker: "B",
    title: "Feria",
    kicker: "Ejemplo de formato",
    format: "Programación musical · varias fechas",
    image: "/images/structure-loadin.jpg",
    imageAlt: "Imagen provisional: estructuras de truss durante un montaje.",
  },
  {
    id: "ejemplo-c",
    marker: "C",
    title: "Evento con causa",
    kicker: "Ejemplo de formato",
    format: "En colaboración con instituciones",
    image: "/images/spot-stage.jpg",
    imageAlt: "Imagen provisional: micrófono bajo un cañón de luz.",
  },
];

export const NAV = [
  { href: "#archivo", label: "Archivo" },
  { href: "#eventos", label: "Próximos" },
  { href: "#artistas", label: "Artistas" },
  { href: "#shop", label: "Shop" },
];

export const PRODUCE_STEPS = [
  {
    id: "tipo",
    question: "¿Qué te gustaría producir?",
    kind: "choice" as const,
    options: [
      "Concierto",
      "Festival",
      "Gira",
      "Activación de marca",
      "Evento privado",
      "Otra idea",
    ],
  },
  {
    id: "lugar",
    question: "¿Dónde lo imaginas?",
    kind: "text" as const,
    placeholder: "Ciudad o recinto",
  },
  {
    id: "cuando",
    question: "¿Para cuándo?",
    kind: "choice" as const,
    options: ["Próximos 3 meses", "3 a 6 meses", "Más de 6 meses", "Aún no lo sé"],
  },
  {
    id: "aforo",
    question: "¿Cuánta gente esperas?",
    kind: "choice" as const,
    options: ["Hasta 300", "300 – 1,500", "1,500 – 5,000", "Más de 5,000", "Aún no lo sé"],
  },
  {
    id: "presupuesto",
    question: "¿Tienes un presupuesto aproximado?",
    kind: "choice" as const,
    options: ["Sí, definido", "Tengo un rango", "Lo estamos armando", "Prefiero platicarlo"],
  },
  {
    id: "idea",
    question: "Cuéntanos la idea en una línea.",
    kind: "text" as const,
    placeholder: "Por ejemplo: una noche íntima con banda en vivo…",
  },
  {
    id: "contacto",
    question: "¿Cómo te contactamos?",
    kind: "contact" as const,
  },
];
