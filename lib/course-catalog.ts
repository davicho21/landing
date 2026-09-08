export type Course = {
  id: string;
  nombre: string;
  duracionHoras: number;
  modalidad: string;
  beneficiario: string;
  temario: string[];
};

export type TrainingTrack = {
  id: string;
  nombre: string;
  descripcion: string;
  cursos: Course[];
};

export const TRAINING_TRACKS: TrainingTrack[] = [
  {
    id: "tecnicas",
    nombre: "Habilidades Técnicas",
    descripcion:
      "Para cerrar brechas en el uso estratégico de tecnología, IA y datos que ejecutan el trabajo operativo y administrativo del día a día.",
    cursos: [
      {
        id: "google-workspace",
        nombre: "Google Workspace para equipos productivos",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "Todo el equipo",
        temario: [
          "Colaborar en tiempo real en Docs, Sheets y Slides sin perder el control de versiones",
          "Automatizar tareas repetitivas con formularios y Apps Script",
          "Organizar el trabajo del equipo en Drive y Calendar de forma escalable",
        ],
      },
      {
        id: "analitica-no-analistas",
        nombre: "Analítica de datos para no analistas",
        duracionHoras: 10,
        modalidad: "Curso práctico",
        beneficiario: "Mandos medios y coordinadores",
        temario: [
          "Leer e interpretar tableros y reportes sin ser especialista técnico",
          "Identificar qué preguntas de negocio puede responder un dato",
          "Evitar errores comunes de interpretación estadística",
        ],
      },
      {
        id: "metricas-rrhh-roi",
        nombre: "Métricas de RRHH y ROI de capacitación",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y liderazgo directivo",
        temario: [
          "Definir KPIs de gestión de talento alineados al negocio",
          "Calcular el retorno de inversión de programas de formación",
          "Comunicar resultados de RRHH en el lenguaje del negocio",
        ],
      },
      {
        id: "analitica-predictiva",
        nombre: "Analítica predictiva para decisiones de talento",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "RRHH y liderazgo directivo",
        temario: [
          "Anticipar riesgos de rotación y desempeño con datos históricos",
          "Simular el impacto de nuevas políticas antes de implementarlas",
          "Presentar hallazgos predictivos de forma accionable para la gerencia",
        ],
      },
    ],
  },
  {
    id: "blandas",
    nombre: "Habilidades Blandas",
    descripcion:
      "Para fortalecer la comunicación, la colaboración y la resolución de conflictos que sostienen la convivencia y el trabajo en equipo.",
    cursos: [
      {
        id: "comunicacion-asertiva",
        nombre: "Comunicación asertiva en el trabajo",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
        temario: [
          "Expresar desacuerdos sin generar conflicto",
          "Dar y recibir retroalimentación de forma directa y respetuosa",
          "Establecer límites claros en el equipo de trabajo",
        ],
      },
      {
        id: "trabajo-en-equipo",
        nombre: "Trabajo en equipo y colaboración",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
        temario: [
          "Alinear objetivos individuales con las metas del equipo",
          "Resolver conflictos interpersonales antes de que escalen",
          "Aprovechar la diversidad de perfiles para mejores resultados",
        ],
      },
      {
        id: "resolucion-conflictos",
        nombre: "Negociación y resolución de conflictos",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Líderes y áreas comerciales",
        temario: [
          "Identificar los intereses reales detrás de cada posición",
          "Construir acuerdos de beneficio mutuo",
          "Manejar tácticas de presión sin ceder terreno innecesariamente",
        ],
      },
      {
        id: "aprendizaje-autodirigido",
        nombre: "Cultura de aprendizaje autodirigido",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Todo el equipo",
        temario: [
          "Fomentar la autonomía y la curiosidad como hábito de trabajo",
          "Integrar el aprendizaje en el flujo diario de trabajo",
          "Reconocer y dar visibilidad al aprendizaje autogestionado",
        ],
      },
    ],
  },
  {
    id: "cultura",
    nombre: "Cultura Organizacional",
    descripcion:
      "Para consolidar la alineación ética, la inclusión y el bienestar que sostienen el desempeño sin comprometer la salud del talento.",
    cursos: [
      {
        id: "cultura-organizacional",
        nombre: "Cultura organizacional y employer branding",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y directivos",
        temario: [
          "Definir y comunicar los valores de la empresa de forma consistente",
          "Alinear las prácticas de gestión de personas con la cultura deseada",
          "Convertir a los colaboradores en embajadores de marca",
        ],
      },
      {
        id: "dei-trabajo",
        nombre: "Diversidad, equidad e inclusión en el trabajo",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
        temario: [
          "Reconocer sesgos inconscientes en procesos de selección y evaluación",
          "Crear un ambiente de trabajo psicológicamente seguro",
          "Construir prácticas inclusivas sostenibles en el tiempo",
        ],
      },
      {
        id: "onboarding-efectivo",
        nombre: "Onboarding efectivo para nuevas contrataciones",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y líderes de equipo",
        temario: [
          "Diseñar un plan de los primeros 90 días con hitos claros",
          "Acelerar el tiempo hasta la primera contribución real",
          "Reducir la rotación temprana con seguimiento estructurado",
        ],
      },
      {
        id: "prevencion-burnout",
        nombre: "Prevención del burnout y gestión del estrés",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Todo el equipo",
        temario: [
          "Reconocer señales tempranas de agotamiento en el equipo",
          "Diseñar cargas de trabajo y tiempos de recuperación sostenibles",
          "Gestionar el tecnoestrés derivado del uso constante de herramientas digitales",
        ],
      },
    ],
  },
  {
    id: "liderazgo",
    nombre: "Liderazgo",
    descripcion:
      "Para desarrollar líderes que guíen, motiven y habiliten el crecimiento de sus equipos en entornos híbridos y cambiantes.",
    cursos: [
      {
        id: "liderazgo-situacional",
        nombre: "Liderazgo situacional para nuevos líderes",
        duracionHoras: 8,
        modalidad: "Taller práctico",
        beneficiario: "Líderes recién promovidos",
        temario: [
          "Diagnosticar el nivel de madurez de cada colaborador y adaptar el estilo de liderazgo",
          "Dar instrucciones claras y delegar con seguimiento efectivo",
          "Manejar conversaciones difíciles sin perder la relación de confianza",
        ],
      },
      {
        id: "equipos-remotos",
        nombre: "Gestión de equipos remotos e híbridos",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Gerentes con equipos distribuidos",
        temario: [
          "Establecer rituales de comunicación asíncrona y síncrona",
          "Medir productividad por resultados, no por horas conectadas",
          "Prevenir el aislamiento y sostener la cohesión del equipo a distancia",
        ],
      },
      {
        id: "feedback-efectivo",
        nombre: "Feedback efectivo y evaluación de desempeño",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Líderes de equipo",
        temario: [
          "Estructurar conversaciones de feedback que generen cambio real",
          "Definir criterios de evaluación objetivos y medibles",
          "Documentar el desempeño de forma justa y consistente",
        ],
      },
      {
        id: "liderazgo-bienestar",
        nombre: "Liderazgo del bienestar y desconexión digital",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Líderes de equipo",
        temario: [
          "Modelar hábitos de desconexión digital desde el liderazgo",
          "Establecer políticas realistas de equilibrio vida-trabajo",
          "Sostener el rendimiento del equipo sin sacrificar su salud",
        ],
      },
    ],
  },
  {
    id: "innovacion",
    nombre: "Innovación y Adaptabilidad",
    descripcion:
      "Para elevar la agilidad estratégica, el pensamiento crítico y la adopción intencional de tecnología ante un entorno de negocio en constante disrupción.",
    cursos: [
      {
        id: "diseno-estrategia",
        nombre: "Diseño y comunicación estratégica organizacional",
        duracionHoras: 8,
        modalidad: "Taller práctico",
        beneficiario: "Liderazgo y gerencia",
        temario: [
          "Traducir la visión y misión en un propósito claro y memorable",
          "Diseñar metas estratégicas SMART alineadas a los valores de la empresa",
          "Comunicar la estrategia de forma que el equipo la sienta propia",
        ],
      },
      {
        id: "estrategia-a-ejecucion",
        nombre: "Del plan estratégico a la ejecución en equipo",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Mandos medios y líderes de área",
        temario: [
          "Bajar la estrategia corporativa a objetivos de equipo",
          "Dar seguimiento a metas sin caer en microgestión",
          "Detectar y corregir desalineaciones entre discurso y práctica",
        ],
      },
      {
        id: "rutas-upskilling",
        nombre: "Diseño de rutas de upskilling y reskilling",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "RRHH y líderes de talento",
        temario: [
          "Identificar brechas de habilidades críticas a 2-3 años",
          "Diseñar rutas de aprendizaje personalizadas por rol",
          "Medir la efectividad de los programas de capacitación",
        ],
      },
      {
        id: "ia-generativa-trabajo",
        nombre: "IA generativa aplicada al trabajo diario",
        duracionHoras: 8,
        modalidad: "Curso práctico",
        beneficiario: "Equipos administrativos y operativos",
        temario: [
          "Redactar y resumir documentos con asistentes de IA de forma segura",
          "Diseñar prompts efectivos para tareas del día a día",
          "Identificar qué tareas conviene o no automatizar con IA",
        ],
      },
      {
        id: "ia-etica-riesgos",
        nombre: "Uso ético y crítico de la IA en el trabajo",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
        temario: [
          "Reconocer los riesgos operativos y éticos del uso irreflexivo de la IA",
          "Reducir el miedo y la resistencia al cambio tecnológico en el equipo",
          "Establecer buenas prácticas de verificación y uso responsable",
        ],
      },
    ],
  },
];

export function getTrackById(id: string): TrainingTrack | undefined {
  return TRAINING_TRACKS.find((track) => track.id === id);
}
