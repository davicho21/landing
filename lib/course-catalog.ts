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
        temario: [
          "Diagnosticar necesidades reales del cliente antes de ofrecer una solución",
          "Manejar objeciones sin recurrir a descuentos",
          "Cerrar acuerdos basados en valor, no en precio",
        ],
      },
      {
        id: "experiencia-cliente",
        nombre: "Experiencia y servicio al cliente de alto impacto",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Equipos de atención al cliente",
        temario: [
          "Resolver reclamos convirtiendo una mala experiencia en fidelización",
          "Personalizar la atención según el perfil del cliente",
          "Medir y mejorar la satisfacción de forma continua",
        ],
      },
      {
        id: "negociacion-efectiva",
        nombre: "Negociación efectiva",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Equipos comerciales y de compras",
        temario: [
          "Identificar los intereses reales detrás de cada posición",
          "Construir acuerdos de beneficio mutuo",
          "Manejar tácticas de presión sin ceder terreno innecesariamente",
        ],
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
        temario: [
          "Expresar desacuerdos sin generar conflicto",
          "Dar y recibir retroalimentación de forma directa y respetuosa",
          "Establecer límites claros en el equipo de trabajo",
        ],
      },
      {
        id: "presentaciones-alto-impacto",
        nombre: "Presentaciones de alto impacto",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "Roles con exposición a clientes o directivos",
        temario: [
          "Estructurar un mensaje claro y memorable para cualquier audiencia",
          "Usar storytelling y datos para respaldar una propuesta",
          "Manejar los nervios y preguntas difíciles con seguridad",
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
        temario: [
          "Colaborar en tiempo real en Docs, Sheets y Slides sin perder el control de versiones",
          "Automatizar tareas repetitivas con formularios y Apps Script",
          "Organizar el trabajo del equipo en Drive y Calendar de forma escalable",
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
        id: "gestion-del-tiempo",
        nombre: "Gestión del tiempo y prioridades",
        duracionHoras: 4,
        modalidad: "Taller corto",
        beneficiario: "Todo el equipo",
        temario: [
          "Priorizar tareas según impacto real, no solo urgencia",
          "Reducir el multitasking y las interrupciones constantes",
          "Planificar la semana con bloques de tiempo protegido",
        ],
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
        temario: [
          "Diseñar un plan de los primeros 90 días con hitos claros",
          "Acelerar el tiempo hasta la primera contribución real",
          "Reducir la rotación temprana con seguimiento estructurado",
        ],
      },
      {
        id: "cultura-organizacional",
        nombre: "Cultura organizacional y employer branding",
        duracionHoras: 6,
        modalidad: "Taller práctico",
        beneficiario: "RRHH y liderazgo",
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
        beneficiario: "RRHH y liderazgo",
        temario: [
          "Definir KPIs de gestión de talento alineados al negocio",
          "Calcular el retorno de inversión de programas de formación",
          "Comunicar resultados de RRHH en el lenguaje del negocio",
        ],
      },
    ],
  },
];

export function getTrackById(id: string): TrainingTrack | undefined {
  return TRAINING_TRACKS.find((track) => track.id === id);
}
