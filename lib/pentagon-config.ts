export type PentagonQuestion = {
  id: string;
  texto: string;
};

export type PentagonArea = {
  id: string;
  nombre: string;
  nombreCorto: string;
  descripcion: string;
  trackId: string;
  preguntas: [PentagonQuestion, PentagonQuestion, PentagonQuestion];
};

export const PENTAGON_AREAS: PentagonArea[] = [
  {
    id: "tecnicas",
    nombre: "Habilidades Técnicas",
    nombreCorto: "Técnicas",
    descripcion:
      "Nivel de competencia para operar software, automatizar con IA, ejecutar procesos sectoriales específicos y tomar decisiones basadas en datos.",
    trackId: "tecnicas",
    preguntas: [
      {
        id: "tecnicas-p1",
        texto:
          "¿Utilizamos las tecnologías actuales e Inteligencia Artificial con un propósito estratégico claro para automatizar tareas repetitivas y optimizar el rendimiento del día a día?",
      },
      {
        id: "tecnicas-p2",
        texto:
          "¿Contamos con capacitación técnica y actualización profesional en normas, regulaciones o metodologías críticas propias del sector?",
      },
      {
        id: "tecnicas-p3",
        texto:
          "¿Nuestros colaboradores dominan el uso de analítica de datos y métricas financieras o de productividad (como el ROI) para justificar y evaluar el impacto de sus decisiones?",
      },
    ],
  },
  {
    id: "blandas",
    nombre: "Habilidades Blandas",
    nombreCorto: "Blandas",
    descripcion:
      "Capacidad de comunicación interpersonal, sinergia grupal, asertividad en las relaciones internas y resolución dialogada de conflictos.",
    trackId: "blandas",
    preguntas: [
      {
        id: "blandas-p1",
        texto:
          "¿La comunicación organizacional fluye de manera efectiva, transparente y asertiva en todas las direcciones (ascendente, descendente y horizontal)?",
      },
      {
        id: "blandas-p2",
        texto:
          "¿Fomentamos un clima de trabajo en equipo donde impera la confianza mutua, la escucha activa y la colaboración interdepartamental para lograr metas comunes?",
      },
      {
        id: "blandas-p3",
        texto:
          "¿Se abordan los conflictos cotidianos de forma oportuna a través del diálogo directo, la empatía y mecanismos de negociación conjunta?",
      },
    ],
  },
  {
    id: "cultura",
    nombre: "Cultura Organizacional",
    nombreCorto: "Cultura",
    descripcion:
      "Integración del propósito corporativo en el día a día, equidad laboral, bienestar de los equipos y prevención del burnout operativo.",
    trackId: "cultura",
    preguntas: [
      {
        id: "cultura-p1",
        texto:
          "¿Existe una conexión real y un alineamiento genuino entre el propósito, misión y valores de la empresa y los objetivos personales de los colaboradores?",
      },
      {
        id: "cultura-p2",
        texto:
          "¿Promovemos de forma activa el equilibrio vida-trabajo a través de la desconexión digital, flexibilidad laboral y sistemas para prevenir el agotamiento (burnout)?",
      },
      {
        id: "cultura-p3",
        texto:
          "¿Se integran de forma tangible los comportamientos de equidad, respeto a la diversidad y justicia en la cultura laboral cotidiana?",
      },
    ],
  },
  {
    id: "liderazgo",
    nombre: "Liderazgo",
    nombreCorto: "Liderazgo",
    descripcion:
      "Capacidad de los cuadros de mando para motivar de manera empática, dar feedback útil y habilitar redes horizontales de aprendizaje social.",
    trackId: "liderazgo",
    preguntas: [
      {
        id: "liderazgo-p1",
        texto:
          "¿Nuestros líderes ejercen un rol inspirador, de apoyo cercano y escucha empática frente a sus equipos, en lugar de un mando rígido e inflexible?",
      },
      {
        id: "liderazgo-p2",
        texto:
          "¿Nuestros líderes brindan retroalimentación constructiva frecuente y estructurada que impulsa el crecimiento continuo del colaborador?",
      },
      {
        id: "liderazgo-p3",
        texto:
          "¿Se promueven formal o informalmente esquemas de co-aprendizaje, mentoría y traspaso de conocimientos internos entre distintas áreas?",
      },
    ],
  },
  {
    id: "innovacion",
    nombre: "Innovación y Adaptabilidad",
    nombreCorto: "Innovación",
    descripcion:
      "Flexibilidad estratégica del personal ante disrupciones de mercado, mentalidad de cambio continuo y asimilación crítica de tecnologías emergentes.",
    trackId: "innovacion",
    preguntas: [
      {
        id: "innovacion-p1",
        texto:
          "¿Se motiva constantemente a los equipos a analizar situaciones críticas, proponer ideas innovadoras y cuestionar flujos tradicionales para mejorar la operación?",
      },
      {
        id: "innovacion-p2",
        texto:
          "¿La organización reacciona con agilidad y flexibilidad para ajustar sus proyectos, procesos y metas ante los cambios o disrupciones del mercado?",
      },
      {
        id: "innovacion-p3",
        texto:
          "¿Facilitamos rutas ágiles de capacitación que empoderen al colaborador mediante el autoaprendizaje en el flujo del trabajo para cerrar brechas críticas?",
      },
    ],
  },
];

export function getAreaById(id: string): PentagonArea | undefined {
  return PENTAGON_AREAS.find((area) => area.id === id);
}
