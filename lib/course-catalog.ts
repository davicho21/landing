export type Course = {
  id: string;
  nombre: string;
  duracionHoras: number;
  modalidad: string;
  beneficiario: string;
};

export type TrainingTrack = {
  id: string;
  nombre: string;
  descripcion: string;
  cursos: Course[];
};

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: "liderazgo",
    nombre: "Liderazgo y Gestión de Equipos",
    descripcion:
      "Para desarrollar líderes capaces de guiar equipos, dar feedback efectivo y sostener el desempeño en el tiempo.",
    cursos: [
      {
        id: "liderazgo-situacional",
        nombre: "Liderazgo situacional para nuevos líderes",
        duracionHoras: 8,
        modalidad: "Taller práctico",
        beneficiario: "Líderes de equipo recién promovidos",
      },
      {
        id: "equipos-remotos",
        nombre: "Gestión de equipos remotos e híbridos",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Gerentes con equipos distribuidos",
      },
      {
        id: "feedback-efectivo",
        nombre: "Feedback efectivo y evaluación de desempeño",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Líderes de equipo",
      },
    ],
  },
  {
    id: "ventas",
    nombre: "Ventas y Atención al Cliente",
    descripcion:
      "Para equipos comerciales y de servicio que necesitan mejorar conversión, retención y satisfacción del cliente.",
    cursos: [
      {
        id: "venta-consultiva",
        nombre: "Venta consultiva B2B",
        duracionHoras: 10,
        modalidad: "Curso con práctica guiada",
        beneficiario: "Equipos de ventas",
      },
      {
        id: "experiencia-cliente",
        nombre: "Experiencia y servicio al cliente de alto impacto",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Equipos de atención al cliente",
      },
      {
        id: "negociacion-efectiva",
        nombre: "Negociación efectiva",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Equipos comerciales y de compras",
      },
    ],
  },
  {
    id: "comunicacion",
    nombre: "Comunicación y Habilidades Blandas",
    descripcion:
      "Para fortalecer la colaboración interna y la forma en la que los equipos se comunican dentro y fuera de la empresa.",
    cursos: [
      {
        id: "comunicacion-asertiva",
        nombre: "Comunicación asertiva en el trabajo",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
      },
      {
        id: "presentaciones-alto-impacto",
        nombre: "Presentaciones de alto impacto",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Roles con exposición a clientes o directivos",
      },
      {
        id: "trabajo-en-equipo",
        nombre: "Trabajo en equipo y colaboración",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
      },
    ],
  },
  {
    id: "productividad-digital",
    nombre: "Productividad y Transformación Digital",
    descripcion:
      "Para equipos que necesitan trabajar de forma más eficiente aprovechando herramientas digitales y de IA.",
    cursos: [
      {
        id: "google-workspace",
        nombre: "Google Workspace para equipos productivos",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "Todo el equipo",
      },
      {
        id: "ia-generativa-trabajo",
        nombre: "IA generativa aplicada al trabajo diario",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "Equipos administrativos y operativos",
      },
      {
        id: "gestion-del-tiempo",
        nombre: "Gestión del tiempo y prioridades",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
      },
    ],
  },
  {
    id: "cultura-talento",
    nombre: "Cultura, Onboarding y Talento",
    descripcion:
      "Para fortalecer la cultura organizacional y asegurar que las nuevas incorporaciones se integren rápido y bien.",
    cursos: [
      {
        id: "onboarding-efectivo",
        nombre: "Onboarding efectivo para nuevas contrataciones",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y líderes de equipo",
      },
      {
        id: "cultura-organizacional",
        nombre: "Cultura organizacional y employer branding",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y liderazgo",
      },
      {
        id: "dei-trabajo",
        nombre: "Diversidad, equidad e inclusión en el trabajo",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
      },
    ],
  },
  {
    id: "datos-decisiones",
    nombre: "Data y Analítica para Decisiones",
    descripcion:
      "Para que los equipos aprendan a leer datos y usarlos para tomar mejores decisiones, incluida la medición del ROI de la propia capacitación.",
    cursos: [
      {
        id: "analitica-no-analistas",
        nombre: "Analítica de datos para no analistas",
        duracionHoras: 10,
        modalidad: "Curso práctico",
        beneficiario: "Mandos medios y coordinadores",
      },
      {
        id: "metricas-rrhh-roi",
        nombre: "Métricas de RRHH y ROI de capacitación",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y liderazgo",
      },
    ],
  },
];

export function getTrackById(id: string): TrainingTrack | undefined {
  return TRAINING_TRACKS.find((track) => track.id === id);
}
