export type WheelQuestion = {
  id: string;
  texto: string;
};

export type WheelAspect = {
  id: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  trackId: string;
  preguntas: [WheelQuestion, WheelQuestion];
};

export const WHEEL_ASPECTS: WheelAspect[] = [
  {
    id: "estrategia",
    nombre: "Estrategia y Propósito",
    nombreCorto: "Estrategia",
    descripcion:
      "Evalúa la claridad del rumbo organizacional y la conexión emocional del equipo con sus metas.",
    trackId: "estrategia-proposito",
    preguntas: [
      {
        id: "estrategia-p1",
        texto:
          "¿Nuestra declaración de misión articula claramente nuestro propósito y razón de ser en el contexto actual?",
      },
      {
        id: "estrategia-p2",
        texto:
          "¿Están las metas estratégicas (SMART) alineadas con los valores reales de la empresa y son compartidas por todo el equipo?",
      },
    ],
  },
  {
    id: "liderazgo",
    nombre: "Liderazgo Transformacional y Empatía",
    nombreCorto: "Liderazgo",
    descripcion:
      "Mide la capacidad de los líderes para inspirar y gestionar equipos humanos en entornos cambiantes.",
    trackId: "liderazgo",
    preguntas: [
      {
        id: "liderazgo-p1",
        texto:
          "¿Nuestros líderes inspiran, motivan y consideran individualmente a los miembros del equipo en lugar de aplicar un mando rígido?",
      },
      {
        id: "liderazgo-p2",
        texto:
          "¿La gerencia demuestra cuidado y apoyo real a través de acciones basadas en la empatía y la escucha activa?",
      },
    ],
  },
  {
    id: "cultura",
    nombre: "Cultura, Justicia y Equidad",
    nombreCorto: "Cultura",
    descripcion: "Analiza el entorno ético, la inclusión y la pertenencia dentro de la organización.",
    trackId: "cultura-talento",
    preguntas: [
      {
        id: "cultura-p1",
        texto:
          "¿Se integran los valores de diversidad, equidad y justicia en los comportamientos y procesos del día a día?",
      },
      {
        id: "cultura-p2",
        texto:
          "¿Existe un alineamiento genuino entre las metas personales de los empleados y las metas estratégicas de la empresa?",
      },
    ],
  },
  {
    id: "aprendizaje",
    nombre: "Aprendizaje Continuo (Upskilling y Reskilling)",
    nombreCorto: "Aprendizaje",
    descripcion: "Evalúa la agilidad de la fuerza laboral para adaptarse a nuevas demandas tecnológicas.",
    trackId: "aprendizaje-continuo",
    preguntas: [
      {
        id: "aprendizaje-p1",
        texto:
          "¿Contamos con programas de capacitación personalizados que cierren las brechas de habilidades críticas para los próximos 2-3 años?",
      },
      {
        id: "aprendizaje-p2",
        texto:
          "¿Fomentamos la autonomía del empleado mediante el aprendizaje autodirigido y la formación en el flujo del trabajo?",
      },
    ],
  },
  {
    id: "bienestar",
    nombre: "Bienestar y Salud Mental",
    nombreCorto: "Bienestar",
    descripcion:
      "Mide la capacidad de la organización para sostener el rendimiento sin comprometer la salud del talento.",
    trackId: "bienestar",
    preguntas: [
      {
        id: "bienestar-p1",
        texto:
          "¿Promovemos activamente el equilibrio vida-trabajo mediante flexibilidad laboral y políticas de desconexión digital?",
      },
      {
        id: "bienestar-p2",
        texto:
          "¿Existen sistemas para prevenir el agotamiento (burnout) y mitigar el tecnoestrés derivado del auge tecnológico?",
      },
    ],
  },
  {
    id: "comunicacion",
    nombre: "Comunicación y Resolución de Conflictos",
    nombreCorto: "Comunicación",
    descripcion:
      "Evalúa la fluidez de la información y la capacidad de gestionar desacuerdos de forma constructiva.",
    trackId: "comunicacion",
    preguntas: [
      {
        id: "comunicacion-p1",
        texto:
          "¿La comunicación fluye de manera efectiva en todas las direcciones (ascendente, descendente y horizontal)?",
      },
      {
        id: "comunicacion-p2",
        texto:
          "¿Se resuelven los conflictos de forma oportuna a través del diálogo, la asertividad y la negociación conjunta?",
      },
    ],
  },
  {
    id: "tecnologia",
    nombre: "Tecnología e Inteligencia Artificial con Intencionalidad",
    nombreCorto: "Tecnología/IA",
    descripcion: "Analiza cómo la organización integra la tecnología como un componente estructural del negocio.",
    trackId: "productividad-digital",
    preguntas: [
      {
        id: "tecnologia-p1",
        texto:
          "¿Utilizamos la IA y las herramientas digitales con una intencionalidad clara para mejorar la productividad y resolver problemas específicos?",
      },
      {
        id: "tecnologia-p2",
        texto:
          "¿Capacitamos a los colaboradores en el uso ético y crítico de la IA para reducir miedos emocionales y riesgos operativos?",
      },
    ],
  },
  {
    id: "analitica",
    nombre: "Evaluación de Impacto y Analítica de Datos",
    nombreCorto: "Analítica",
    descripcion: "Mide si la toma de decisiones se basa en evidencia y resultados tangibles.",
    trackId: "datos-decisiones",
    preguntas: [
      {
        id: "analitica-p1",
        texto:
          "¿Utilizamos medidas empresariales robustas (como el ROI y aumento de productividad) para justificar nuestras inversiones en talento?",
      },
      {
        id: "analitica-p2",
        texto:
          "¿Usamos analítica de datos predictiva para anticipar riesgos y simular el impacto de nuevas políticas antes de aplicarlas?",
      },
    ],
  },
];

export function getAspectById(id: string): WheelAspect | undefined {
  return WHEEL_ASPECTS.find((aspect) => aspect.id === id);
}
