import { Document, Page, View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { RecommendationResult } from "@/lib/recommendation-engine";
import type { Course } from "@/lib/course-catalog";
import type { DiagnosticAnswers } from "@/lib/types";
import { NUM_PERSONAS_OPTIONS, TIEMPO_DISPONIBLE_OPTIONS } from "@/lib/types";
import { getTrackById } from "@/lib/course-catalog";
import { LOGO_LOCKUP_DARK_DATA_URI, LOGO_LOCKUP_LIGHT_DATA_URI } from "@/lib/pdf/logo-assets";

// Sin esto, react-pdf parte palabras largas con un guion a mitad (ej.
// "re-comendada") al ajustar el ancho del texto. Al devolver la palabra
// completa como único "fragmento", el wrap solo ocurre en espacios.
Font.registerHyphenationCallback((word) => [word]);

const LOGO_LOCKUP_DARK = LOGO_LOCKUP_DARK_DATA_URI;
const LOGO_LOCKUP_LIGHT = LOGO_LOCKUP_LIGHT_DATA_URI;
const LOGO_ASPECT = 408 / 124;

const COLORS = {
  bg: "#070b14",
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
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: COLORS.wordmarkDark,
    fontWeight: 700,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 14,
    borderBottom: `2px solid ${COLORS.accent}`,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginTop: 18,
    marginBottom: 8,
    color: COLORS.wordmarkDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  qaBlock: {
    marginBottom: 12,
    paddingLeft: 12,
    borderLeft: `2px solid #e4e7f0`,
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
    flexDirection: "row",
    backgroundColor: "#f5f7fb",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    border: "1px solid #e4e7f0",
  },
  cardBar: {
    width: 5,
  },
  cardBody: {
    flex: 1,
    padding: 14,
  },
  cardHeadRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 4,
    flex: 1,
  },
  cardMeta: {
    fontSize: 10,
    color: COLORS.bodyMuted,
  },
  pill: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.bodyText,
    backgroundColor: "#dffcec",
    borderRadius: 8,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    paddingRight: 8,
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
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 10,
  },
  statTile: {
    width: "47%",
    backgroundColor: "#0d1428",
    borderRadius: 8,
    padding: 14,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 700,
    color: COLORS.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 9.5,
    color: COLORS.muted,
    lineHeight: 1.4,
  },
  stepRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: 700,
    color: "#06110a",
  },
});

function LogoLockup({ variant, height = 16 }: { variant: "light" | "dark"; height?: number }) {
  const src = variant === "light" ? LOGO_LOCKUP_LIGHT : LOGO_LOCKUP_DARK;
  // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image (PDF output), not an HTML/next <img>; it has no alt prop.
  return <Image src={src} style={{ width: height * LOGO_ASPECT, height }} />;
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
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowDot} />
          <Text style={styles.eyebrow}>{eyebrow}</Text>
        </View>
        <Text style={styles.pageTitle}>{title}</Text>
      </View>
      <LogoLockup variant="dark" />
    </View>
  );
}

function CourseCard({ course, accentColor }: { course: Course; accentColor: string }) {
  return (
    <View style={styles.card} wrap={false}>
      <View style={[styles.cardBar, { backgroundColor: accentColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeadRow}>
          <Text style={styles.cardTitle}>{course.nombre}</Text>
          <Text style={styles.pill}>{course.duracionHoras}h</Text>
        </View>
        <Text style={styles.cardMeta}>
          {course.modalidad} · Para: {course.beneficiario}
        </Text>
      </View>
    </View>
  );
}

function StatTile({ number, label }: { number: string; label: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StepItem({ number, title, text }: { number: number; title: string; text: string }) {
  return (
    <View style={styles.stepRow} wrap={false}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{number}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{title}</Text>
        <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted, lineHeight: 1.4 }}>{text}</Text>
      </View>
    </View>
  );
}

function CoverBlobs() {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: 160,
          backgroundColor: COLORS.accent,
          opacity: 0.12,
        }}
      />
      <View
        style={{
          position: "absolute",
          bottom: -140,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: COLORS.accent2,
          opacity: 0.1,
        }}
      />
    </>
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
        <CoverBlobs />
        <LogoLockup variant="light" />
        <View>
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: COLORS.accent,
              borderRadius: 10,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#06110a" }}>
              Informe de diagnóstico de formación
            </Text>
          </View>
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>Ruta de formación</Text>
            <Text style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
              <Text style={{ color: COLORS.accent }}>recomendada</Text> para tu equipo
            </Text>
          </View>
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

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>
          Con base en tus respuestas, tu equipo está en una etapa donde la formación puede tener un impacto
          directo y medible. La necesidad declarada — {necesidadLabel.toLowerCase()} — suele estar asociada a
          brechas de habilidades que, si no se atienden, tienden a agravarse con el tiempo y a afectar tanto el
          desempeño individual como los resultados del equipo en conjunto.
        </Text>

        <View style={{ backgroundColor: COLORS.bg, borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 9,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: COLORS.accent,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            La realidad de hoy
          </Text>
          <View style={styles.statGrid}>
            <StatTile number="87%" label="de los directivos reporta brechas de habilidades activas en sus equipos" />
            <StatTile number="95%" label="de los líderes de RRHH considera la capacitación clave para retener talento" />
            <StatTile number="4.3x" label="mejor desempeño financiero en empresas que invierten de forma sostenida en desarrollo" />
            <StatTile number="3x" label="mayor retorno para accionistas en compañías con cultura de aprendizaje fuerte" />
          </View>
          <Text style={{ fontSize: 7.5, color: COLORS.muted }}>
            Cifras de referencia de estudios de industria sobre inversión en talento.
          </Text>
        </View>

        <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
          {notaModalidad} {notaTiempo ?? ""}
        </Text>

        <PageFooter page={3} />
      </Page>

      {/* Página 4: Ruta recomendada */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Recomendación" title="Ruta de formación sugerida" />

        <View style={[styles.card, { backgroundColor: COLORS.bg }]} wrap={false}>
          <View style={[styles.cardBar, { backgroundColor: COLORS.accent }]} />
          <View style={styles.cardBody}>
            <Text style={{ fontSize: 14, fontWeight: 700, color: COLORS.textLight, marginBottom: 4 }}>
              {track.nombre}
            </Text>
            <Text style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.5 }}>{track.descripcion}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Curso principal</Text>
        <CourseCard course={cursoPrincipal} accentColor={COLORS.accent} />

        {cursosComplementarios.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Cursos complementarios</Text>
            {cursosComplementarios.map((curso) => (
              <CourseCard key={curso.id} course={curso} accentColor={COLORS.accent2} />
            ))}
          </>
        )}

        <PageFooter page={4} />
      </Page>

      {/* Página 5: Detalle de cursos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Detalle" title="Cursos recomendados en profundidad" />

        {[cursoPrincipal, ...cursosComplementarios].map((curso, index) => (
          <View key={curso.id} style={styles.card} wrap={false}>
            <View
              style={[styles.cardBar, { backgroundColor: index === 0 ? COLORS.accent : COLORS.accent2 }]}
            />
            <View style={styles.cardBody}>
              <View style={styles.cardHeadRow}>
                <Text style={styles.cardTitle}>
                  {index + 1}. {curso.nombre}
                </Text>
                <Text style={styles.pill}>{curso.duracionHoras}h</Text>
              </View>
              <Text style={{ fontSize: 10 }}>Modalidad: {curso.modalidad}</Text>
              <Text style={{ fontSize: 10 }}>A quién beneficia: {curso.beneficiario}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Nota sobre la modalidad para tu equipo</Text>
        <Text style={{ fontSize: 11, lineHeight: 1.5 }}>{notaModalidad}</Text>

        <PageFooter page={5} />
      </Page>

      {/* Página 6: Próximos pasos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Siguiente paso" title="Cómo avanzar con Academia Referente" />

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 18 }}>
          Este informe es un punto de partida. Un especialista de Academia Referente puede ayudarte a ajustar
          esta ruta a la realidad de tu equipo, definir cronograma y resolver cualquier duda sobre modalidad o
          inversión.
        </Text>

        <StepItem
          number={1}
          title="Agenda una llamada de diagnóstico"
          text="Conversemos sobre los resultados de este informe y cómo aplicarlos a tu contexto específico."
        />
        <StepItem
          number={2}
          title="Define el equipo participante"
          text="Con base en el número de personas que nos indicaste, te ayudamos a definir cohortes si aplica."
        />
        <StepItem
          number={3}
          title="Arranca la ruta de formación"
          text="Empezamos con el curso principal recomendado y ajustamos el resto de la ruta sobre la marcha."
        />

        <View
          style={{
            marginTop: 20,
            backgroundColor: COLORS.bg,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 700, color: COLORS.textLight }}>
            Escríbenos y sigamos la conversación
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 2 }}>academiareferentes.com</Text>
        </View>

        <PageFooter page={6} />
      </Page>
    </Document>
  );
}
