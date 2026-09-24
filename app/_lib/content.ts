// Contenido demostrativo del prototipo V1.
// Todo es provisional: fechas demo, recintos por confirmar, sin métricas.
// Banda Torera del Valle es el único proyecto real mencionado.

export const REGION = "Jalisco · México";

export type LagoEvent = {
  id: string;
  /** Marcador conceptual — no es una numeración real. */
  marker: string;
  title: string;
  kicker: string;
  format: string;
  weekday: string;
  day: string;
  month: string;
  monthIndex: number;
  year: number;
  venue: string;
  image: string;
  imageAlt: string;
};

export const EVENTS: LagoEvent[] = [
  {
    id: "concepto-a",
    marker: "A",
    title: "Banda Torera del Valle",
    kicker: "En vivo",
    format: "Concierto",
    weekday: "Sáb",
    day: "14",
    month: "Nov",
    monthIndex: 10,
    year: 2026,
    venue: "Recinto por confirmar",
    image: "/images/spot-stage.jpg",
    imageAlt: "Micrófono solo bajo un cañón de luz sobre un escenario oscuro.",
  },
  {
    id: "concepto-b",
    marker: "B",
    title: "Noche Lago",
    kicker: "Formato club",
    format: "Line-up por anunciar",
    weekday: "Sáb",
    day: "28",
    month: "Nov",
    monthIndex: 10,
    year: 2026,
    venue: "Recinto por confirmar",
    image: "/images/crowd-wash.jpg",
    imageAlt: "Público a contraluz con las manos arriba frente a un escenario iluminado.",
  },
  {
    id: "concepto-c",
    marker: "C",
    title: "Escenario Abierto",
    kicker: "Ciclo de nuevas propuestas",
    format: "Convocatoria en diseño",
    weekday: "Sáb",
    day: "12",
    month: "Dic",
    monthIndex: 11,
    year: 2026,
    venue: "Recinto por confirmar",
    image: "/images/backstage-wings.jpg",
    imageAlt: "Vista desde las piernas del escenario hacia haces de luz.",
  },
  {
    id: "concepto-d",
    marker: "D",
    title: "Gran Formato",
    kicker: "Festival",
    format: "Concepto en desarrollo",
    weekday: "Sáb",
    day: "23",
    month: "Ene",
    monthIndex: 0,
    year: 2027,
    venue: "Recinto por confirmar",
    image: "/images/structure-loadin.jpg",
    imageAlt: "Estructuras de truss y luces de trabajo durante un montaje.",
  },
];

export const NAV = [
  { href: "#eventos", label: "Eventos" },
  { href: "#archivo", label: "Archivo" },
  { href: "#calendario", label: "Calendario" },
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
