export const PAISES = [
  "Colombia",
  "México",
  "Perú",
  "Chile",
  "Argentina",
  "Bolivia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Estados Unidos",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  "Otro",
];

export const AREA_DESEMPENO_OPTIONS = [
  "Recursos Humanos / Gestión del Talento / L&D",
  "Dirección General / C-Level",
  "Operaciones / Producción",
  "Administración y Finanzas",
  "Tecnología / Sistemas / TI",
  "Ventas y Comercial / Marketing",
  "Otra área",
];

export const INDUSTRIA_OPTIONS = [
  "Tecnología y Software",
  "Servicios Financieros y Seguros",
  "Manufactura e Industrial",
  "Retail / Consumo Masivo / Comercio",
  "Salud / Farmacéutica / Biotecnología",
  "Educación",
  "Logística y Transporte",
  "Telecomunicaciones",
  "Consultoría y Servicios Profesionales",
  "Otra Industria",
];

export const NUM_COLABORADORES_OPTIONS = [
  "1 - 20 (Microempresa / Startup inicial)",
  "21 - 50 (Pequeña empresa)",
  "51 - 100 (Pequeña-Mediana)",
  "101 - 149 (Mediana en crecimiento)",
  "150 - 500 (Mediana consolidada)",
  "501 - 799 (Mediana-Grande)",
  "800 - 5000 (Gran empresa / Corporativo)",
  "5001 - 10000 (Gran corporación)",
  "Más de 10,000 (Multinacional)",
];

export type DesafioOption = {
  label: string;
  areaId: string;
};

export const DESAFIO_PRINCIPAL_OPTIONS: DesafioOption[] = [
  {
    label: "Actualizar competencias técnicas y uso de herramientas digitales / IA.",
    areaId: "tecnicas",
  },
  {
    label: "Fortalecer la comunicación, el trabajo en equipo y la resolución de conflictos.",
    areaId: "blandas",
  },
  {
    label: "Alinear a los equipos con los valores de la empresa y evitar el agotamiento (burnout).",
    areaId: "cultura",
  },
  {
    label: "Desarrollar líderes empáticos que inspiren y den mejor retroalimentación.",
    areaId: "liderazgo",
  },
  {
    label: "Fomentar la innovación, el pensamiento crítico y la agilidad ante el cambio.",
    areaId: "innovacion",
  },
];
