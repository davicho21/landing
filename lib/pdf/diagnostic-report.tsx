import { Document, Page, View, Text, StyleSheet, Svg, Circle, Rect } from "@react-pdf/renderer";
import type { RecommendationResult } from "@/lib/recommendation-engine";
import type { DiagnosticAnswers } from "@/lib/types";
import { NUM_PERSONAS_OPTIONS, TIEMPO_DISPONIBLE_OPTIONS } from "@/lib/types";
import { getTrackById } from "@/lib/course-catalog";

const COLORS = {
  bg: "#070b14",
  panel: "#111a30",
  accent: "#6fffb0",
  accent2: "#8b9cff",
  textLight: "#f5f7fa",
  muted: "#a8b3c7",
  wordmarkDark: "#2f4fe0",
  bodyBg: "#ffffff",
  bodyText: "#111a30",
  bodyMuted: "#5b6478",
};

const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: COLORS.bg,
    color: COLORS.textLight,
    padding: 48,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  bodyPage: {
    backgroundColor: COLORS.bodyBg,
    color: COLORS.bodyText,
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 11,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.accent,
    marginBottom: 8,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 12,
    borderBottom: `1px solid #e4e7f0`,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 8,
    color: COLORS.wordmarkDark,
  },
  qaBlock: {
    marginBottom: 12,
  },
  question: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: COLORS.bodyMuted,
    marginBottom: 2,
  },
  answer: {
    fontSize: 12,
  },
  card: {
    backgroundColor: "#f5f7fb",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    border: "1px solid #e4e7f0",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 10,
    color: COLORS.bodyMuted,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: COLORS.bodyMuted,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

function LogoIconPdf({ background, size = 22 }: { background: string; size?: number }) {
  const half = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={half} cy={half} r={half} fill={COLORS.accent} />
      <Rect x={half} y={half} width={half} height={half} fill={background} />
    </Svg>
  );
}

function LogoLockup({ variant }: { variant: "light" | "dark" }) {
  const wordmarkColor = variant === "light" ? COLORS.textLight : COLORS.wordmarkDark;
  const background = variant === "light" ? COLORS.bg : COLORS.bodyBg;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <LogoIconPdf background={background} />
      <View>
        <Text style={{ fontSize: 13, fontWeight: 700, color: wordmarkColor }}>Referente</Text>
        <Text style={{ fontSize: 6, letterSpacing: 2, textTransform: "uppercase", color: wordmarkColor }}>
          Academia
        </Text>
      </View>
    </View>
  );
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Academia Referente — Informe de diagnóstico de formación</Text>
      <Text>{page} / 6</Text>
    </View>
  );
}

function BodyPageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <View style={styles.pageHeader}>
      <View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
      <LogoLockup variant="dark" />
    </View>
  );
}

function findLabel(options: readonly { value: string; label: string }[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function DiagnosticReportDocument({
  answers,
  recommendation,
  generatedAt,
}: {
  answers: DiagnosticAnswers;
  recommendation: RecommendationResult;
  generatedAt: Date;
}) {
  const { track, cursoPrincipal, cursosComplementarios, notaModalidad, notaTiempo } = recommendation;
  const necesidadLabel =
    answers.necesidad === "otro"
      ? answers.necesidadOtro
      : getTrackById(answers.necesidad)?.nombre ?? answers.necesidad;

  const dateLabel = generatedAt.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title="Informe de diagnóstico de formación — Academia Referente">
      {/* Página 1: Portada */}
      <Page size="A4" style={styles.coverPage}>
        <LogoLockup variant="light" />
        <View>
          <Text style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: COLORS.accent, marginBottom: 12 }}>
            Informe de diagnóstico de formación
          </Text>
          <Text style={{ fontSize: 30, fontWeight: 700, marginBottom: 12, maxWidth: 380 }}>
            Ruta de formación recomendada para tu equipo
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Preparado para: {answers.email}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Fecha: {dateLabel}</Text>
        </View>
        <Text style={{ fontSize: 9, color: COLORS.muted }}>academiareferentes.com</Text>
      </Page>

      {/* Página 2: Resumen de respuestas */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Resumen" title="Lo que nos contaste" />

        <View style={styles.qaBlock}>
          <Text style={styles.question}>Necesidad de formación</Text>
          <Text style={styles.answer}>{necesidadLabel}</Text>
        </View>
        <View style={styles.qaBlock}>
          <Text style={styles.question}>Por qué es necesaria ahora</Text>
          <Text style={styles.answer}>{answers.motivo}</Text>
        </View>
        <View style={styles.qaBlock}>
          <Text style={styles.question}>Personas que participarán</Text>
          <Text style={styles.answer}>{findLabel(NUM_PERSONAS_OPTIONS, answers.numPersonas)}</Text>
        </View>
        <View style={styles.qaBlock}>
          <Text style={styles.question}>Tiempo disponible</Text>
          <Text style={styles.answer}>{findLabel(TIEMPO_DISPONIBLE_OPTIONS, answers.tiempoDisponible)}</Text>
        </View>
        <View style={styles.qaBlock}>
          <Text style={styles.question}>Qué esperan lograr</Text>
          <Text style={styles.answer}>{answers.objetivo}</Text>
        </View>

        <PageFooter page={2} />
      </Page>

      {/* Página 3: Diagnóstico */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Diagnóstico" title="Interpretación de tu situación" />

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          Con base en tus respuestas, tu equipo está en una etapa donde la formación puede tener un impacto
          directo y medible. La necesidad declarada — {necesidadLabel.toLowerCase()} — suele estar asociada a
          brechas de habilidades que, si no se atienden, tienden a agravarse con el tiempo y a afectar tanto el
          desempeño individual como los resultados del equipo en conjunto.
        </Text>
        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>
          Estudios de la industria muestran que el 87% de los directivos reporta brechas de habilidades activas
          en sus equipos, y que las empresas con una cultura de aprendizaje sostenida obtienen mejores resultados
          financieros. Formalizar esta capacitación — en lugar de dejarla a la iniciativa individual — es lo que
          permite convertirla en una inversión con retorno medible, y no solo en un gasto de RRHH.
        </Text>
        <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
          {notaModalidad} {notaTiempo ?? ""}
        </Text>

        <PageFooter page={3} />
      </Page>

      {/* Página 4: Ruta recomendada */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Recomendación" title="Ruta de formación sugerida" />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{track.nombre}</Text>
          <Text style={{ fontSize: 11, color: COLORS.bodyMuted, lineHeight: 1.5 }}>{track.descripcion}</Text>
        </View>

        <Text style={styles.sectionTitle}>Curso principal</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{cursoPrincipal.nombre}</Text>
          <Text style={styles.cardMeta}>
            {cursoPrincipal.duracionHoras} horas · {cursoPrincipal.modalidad} · Para: {cursoPrincipal.beneficiario}
          </Text>
        </View>

        {cursosComplementarios.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cursos complementarios</Text>
            {cursosComplementarios.map((curso) => (
              <View key={curso.id} style={styles.card}>
                <Text style={styles.cardTitle}>{curso.nombre}</Text>
                <Text style={styles.cardMeta}>
                  {curso.duracionHoras} horas · {curso.modalidad} · Para: {curso.beneficiario}
                </Text>
              </View>
            ))}
          </>
        )}

        <PageFooter page={4} />
      </Page>

      {/* Página 5: Detalle de cursos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Detalle" title="Cursos recomendados en profundidad" />

        {[cursoPrincipal, ...cursosComplementarios].map((curso, index) => (
          <View key={curso.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {index + 1}. {curso.nombre}
            </Text>
            <Text style={{ fontSize: 10, marginTop: 4 }}>Duración: {curso.duracionHoras} horas</Text>
            <Text style={{ fontSize: 10 }}>Modalidad: {curso.modalidad}</Text>
            <Text style={{ fontSize: 10 }}>A quién beneficia: {curso.beneficiario}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Nota sobre la modalidad para tu equipo</Text>
        <Text style={{ fontSize: 11, lineHeight: 1.5 }}>{notaModalidad}</Text>

        <PageFooter page={5} />
      </Page>

      {/* Página 6: Próximos pasos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Siguiente paso" title="Cómo avanzar con Academia Referente" />

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>
          Este informe es un punto de partida. Un especialista de Academia Referente puede ayudarte a ajustar
          esta ruta a la realidad de tu equipo, definir cronograma y resolver cualquier duda sobre modalidad o
          inversión.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>1. Agenda una llamada de diagnóstico</Text>
          <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted }}>
            Conversemos sobre los resultados de este informe y cómo aplicarlos a tu contexto específico.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>2. Define el equipo participante</Text>
          <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted }}>
            Con base en el número de personas que nos indicaste, te ayudamos a definir cohortes si aplica.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>3. Arranca la ruta de formación</Text>
          <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted }}>
            Empezamos con el curso principal recomendado y ajustamos el resto de la ruta sobre la marcha.
          </Text>
        </View>

        <Text style={{ fontSize: 11, marginTop: 20, color: COLORS.wordmarkDark, fontWeight: 700 }}>
          Escríbenos y sigamos la conversación — Academia Referente
        </Text>

        <PageFooter page={6} />
      </Page>
    </Document>
  );
}
