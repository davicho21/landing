import { Document, Page, View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { AreaCritica, RecommendationResult } from "@/lib/recommendation-engine";
import type { Course } from "@/lib/course-catalog";
import type { DiagnosticAnswers } from "@/lib/types";
import { PENTAGON_AREAS } from "@/lib/pentagon-config";
import { LOGO_LOCKUP_DARK_DATA_URI, LOGO_LOCKUP_LIGHT_DATA_URI } from "@/lib/pdf/logo-assets";
import { RadarChart } from "@/lib/pdf/radar-chart";

// Sin esto, react-pdf parte palabras largas con un guion a mitad (ej.
// "re-comendada") al ajustar el ancho del texto. Al devolver la palabra
// completa como único "fragmento", el wrap solo ocurre en espacios.
Font.registerHyphenationCallback((word) => [word]);

const LOGO_LOCKUP_DARK = LOGO_LOCKUP_DARK_DATA_URI;
const LOGO_LOCKUP_LIGHT = LOGO_LOCKUP_LIGHT_DATA_URI;
const LOGO_ASPECT = 408 / 124;

const CONTACT_EMAIL = "academia@consultorareferente.com";
const CONTACT_PHONE = "+57 311 4648297";

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
  critico: "#dc4545",
  consolidacion: "#c98a1a",
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
  coverLogoRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
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
    marginBottom: 20,
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
  cardTitleBlock: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
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
  scaleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  scaleChip: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
  },
  scaleChipLabel: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 2,
  },
  scaleChipRange: {
    fontSize: 8,
    color: COLORS.bodyMuted,
  },
  aspectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  aspectGridItem: {
    width: "47%",
    backgroundColor: "#f5f7fb",
    borderRadius: 8,
    padding: 10,
    border: "1px solid #e4e7f0",
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

function withoutTrailingPeriod(text: string): string {
  return text.trim().replace(/\.+$/, "");
}

function tierColor(promedio: number): string {
  if (promedio <= 4) return COLORS.critico;
  if (promedio <= 7) return COLORS.consolidacion;
  return COLORS.accent;
}

function tierLabel(promedio: number): string {
  if (promedio <= 4) return "Crítico";
  if (promedio <= 7) return "En Consolidación";
  return "Excelencia Estratégica";
}

function LogoLockup({ variant, height = 16 }: { variant: "light" | "dark"; height?: number }) {
  const src = variant === "light" ? LOGO_LOCKUP_LIGHT : LOGO_LOCKUP_DARK;
  // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image (PDF output), not an HTML/next <img>; it has no alt prop.
  return <Image src={src} style={{ width: height * LOGO_ASPECT, height }} />;
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Academia Referente — Índice de Madurez de Formación Corporativa</Text>
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

function CourseCard({
  course,
  accentColor,
  compact = false,
}: {
  course: Course;
  accentColor: string;
  compact?: boolean;
}) {
  return (
    <View style={[styles.card, compact ? { marginBottom: 5 } : {}]} wrap={false}>
      <View style={[styles.cardBar, { backgroundColor: accentColor }]} />
      <View style={[styles.cardBody, compact ? { padding: 8 } : {}]}>
        <View style={styles.cardHeadRow}>
          <Text style={[styles.cardTitle, compact ? { fontSize: 10.5, marginBottom: 2 } : {}]}>{course.nombre}</Text>
          <Text style={styles.pill}>{course.duracionHoras}h</Text>
        </View>
        <Text style={[styles.cardMeta, compact ? { fontSize: 9 } : {}]}>
          {course.modalidad} · Para: {course.beneficiario}
        </Text>
      </View>
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

function AreaCriticaCard({ area, orden }: { area: AreaCritica; orden: number }) {
  const color = tierColor(area.promedio);
  return (
    <View style={styles.card} wrap={false}>
      <View style={[styles.cardBar, { backgroundColor: color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardHeadRow}>
          <Text style={styles.cardTitle}>
            {orden}. {area.aspecto.nombre}
          </Text>
          <Text style={[styles.pill, { backgroundColor: color, color: "#ffffff" }]}>
            {area.promedio.toFixed(1)} / 10
          </Text>
        </View>
        <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted, lineHeight: 1.4 }}>{area.aspecto.descripcion}</Text>
      </View>
    </View>
  );
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
  const { aspectScores, areasCriticas, forma } = recommendation;

  const dateLabel = generatedAt.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title="Índice de Madurez de Formación Corporativa — Academia Referente">
      {/* Página 1: Portada */}
      <Page size="A4" style={styles.coverPage}>
        <CoverBlobs />
        <View style={styles.coverLogoRow}>
          <LogoLockup variant="light" />
        </View>
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
              Diagnóstico de talento corporativo
            </Text>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>
              <Text style={{ color: COLORS.accent }}>Índice</Text> de Madurez de
            </Text>
            <Text style={{ fontSize: 27, fontWeight: 700, lineHeight: 1.2 }}>Formación Corporativa</Text>
          </View>
          <Text style={{ fontSize: 12, color: COLORS.muted, marginBottom: 14 }}>
            Determina el nivel actual del desarrollo profesional dentro de la empresa
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Empresa evaluada: {answers.empresa}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Sector industrial: {answers.industria}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Contacto clave: {answers.email}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Fecha de emisión: {dateLabel}</Text>
        </View>
        <Text style={{ fontSize: 9, color: COLORS.muted }}>academiareferentes.com</Text>
      </Page>

      {/* Página 2: Marco metodológico y las 5 dimensiones */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Metodología" title="Marco metodológico" />

        <Text style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
          Este diagnóstico no es una autoevaluación informal: es una herramienta de alineación estratégica
          construida sobre estándares globales de desarrollo de talento — la taxonomía de habilidades del
          Foro Económico Mundial, el modelo de aprendizaje 70:20:10 del Center for Creative Leadership, los
          enfoques de organización basada en habilidades de consultoras como Deloitte, McKinsey y Gartner, y
          la Taxonomía de Bloom. Evalúa cinco dimensiones estratégicas que determinan la competitividad y el
          bienestar de una organización, cada una calificada de 1 a 10 con base en las respuestas de{" "}
          {withoutTrailingPeriod(answers.empresa)}.
        </Text>

        <Text style={styles.sectionTitle}>Escala de medición</Text>
        <View style={styles.scaleRow}>
          <View style={[styles.scaleChip, { backgroundColor: "#fdecec" }]}>
            <Text style={[styles.scaleChipLabel, { color: COLORS.critico }]}>Nivel Crítico</Text>
            <Text style={styles.scaleChipRange}>1.0 a 4.0 — requiere plan de choque inmediato</Text>
          </View>
          <View style={[styles.scaleChip, { backgroundColor: "#fbf1e0" }]}>
            <Text style={[styles.scaleChipLabel, { color: COLORS.consolidacion }]}>En Consolidación</Text>
            <Text style={styles.scaleChipRange}>5.0 a 7.0 — funciona de forma parcial, con silos</Text>
          </View>
          <View style={[styles.scaleChip, { backgroundColor: "#e3fcef" }]}>
            <Text style={[styles.scaleChipLabel, { color: "#1f8f56" }]}>Excelencia Estratégica</Text>
            <Text style={styles.scaleChipRange}>8.0 a 10.0 — fortaleza consolidada, motor de crecimiento</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Las 5 dimensiones evaluadas</Text>
        <View style={styles.aspectGrid}>
          {PENTAGON_AREAS.map((aspecto) => (
            <View key={aspecto.id} style={styles.aspectGridItem}>
              <Text style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 2 }}>{aspecto.nombre}</Text>
              <Text style={{ fontSize: 9, color: COLORS.bodyMuted, lineHeight: 1.3 }}>{aspecto.descripcion}</Text>
            </View>
          ))}
        </View>

        <PageFooter page={2} />
      </Page>

      {/* Página 3: El Pentágono de la Formación Corporativa */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Resultado" title="Tu Pentágono de Formación Corporativa" />

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <RadarChart aspectScores={aspectScores} />
        </View>

        <View style={styles.aspectGrid}>
          {aspectScores.map((score) => (
            <View
              key={score.aspecto.id}
              style={[styles.aspectGridItem, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}
            >
              <Text style={{ fontSize: 9.5, fontWeight: 700 }}>{score.aspecto.nombreCorto}</Text>
              <Text style={{ fontSize: 9.5, fontWeight: 700, color: tierColor(score.promedio) }}>
                {score.promedio.toFixed(1)} · {tierLabel(score.promedio)}
              </Text>
            </View>
          ))}
        </View>

        <PageFooter page={3} />
      </Page>

      {/* Página 4: Análisis e interpretación ejecutiva */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Interpretación" title="Análisis e interpretación ejecutiva" />

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>{forma.mensaje}</Text>

        <Text style={styles.sectionTitle}>Áreas críticas prioritarias</Text>
        <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted, lineHeight: 1.4, marginBottom: 10 }}>
          Estas son las 2 dimensiones con menor puntaje. Mantener estas brechas abiertas representa un riesgo
          estratégico para la organización y debe atenderse primero.
        </Text>
        {areasCriticas.map((area, index) => (
          <AreaCriticaCard key={area.aspecto.id} area={area} orden={index + 1} />
        ))}

        <PageFooter page={4} />
      </Page>

      {/* Página 5: Ruta de formación personalizada */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Recomendación" title="Ruta de formación personalizada" />

        {areasCriticas.map((area, index) => (
          <View key={area.aspecto.id} wrap={false}>
            <View style={[styles.card, { backgroundColor: COLORS.bg, marginTop: index === 0 ? 0 : 4, marginBottom: 5 }]}>
              <View style={[styles.cardBar, { backgroundColor: tierColor(area.promedio) }]} />
              <View style={[styles.cardBody, { padding: 9 }]}>
                <Text style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.textLight, marginBottom: 2 }}>
                  {area.track.nombre}
                </Text>
                <Text style={{ fontSize: 9.5, color: COLORS.muted, lineHeight: 1.3 }}>{area.track.descripcion}</Text>
              </View>
            </View>

            <CourseCard course={area.cursoPrincipal} accentColor={COLORS.accent} compact />
            {area.cursosComplementarios.map((curso) => (
              <CourseCard key={curso.id} course={curso} accentColor={COLORS.accent2} compact />
            ))}
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Alineación curricular (metodología 70:20:10)</Text>
        <Text style={{ fontSize: 9.5, color: COLORS.bodyMuted, lineHeight: 1.3 }}>
          Estos cursos representan el 10% formal del aprendizaje. Para garantizar impacto real, recomendamos
          habilitar también el 20% social — mentoría y traspaso de conocimiento entre pares — y el 70%
          experiencial, aplicando lo aprendido directamente en el trabajo diario del equipo.
        </Text>

        <PageFooter page={5} />
      </Page>

      {/* Página 6: Plan de acción y próximos pasos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Siguiente paso" title="Plan de acción y próximos pasos" />

        <Text style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
          Empieza por los cursos principales de tus dos áreas críticas:
        </Text>

        {areasCriticas.map((area) => (
          <View key={area.aspecto.id} style={styles.card} wrap={false}>
            <View style={[styles.cardBar, { backgroundColor: tierColor(area.promedio) }]} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitleBlock}>{area.cursoPrincipal.nombre}</Text>
              {area.cursoPrincipal.temario.map((punto) => (
                <View key={punto} style={{ flexDirection: "row", gap: 6, marginTop: 3 }}>
                  <Text style={{ fontSize: 9.5, color: COLORS.bodyMuted }}>•</Text>
                  <Text style={{ fontSize: 9.5, color: COLORS.bodyMuted, flex: 1, lineHeight: 1.3 }}>{punto}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Plan de mejora en 3 pasos</Text>
        <StepItem
          number={1}
          title="Socializar el Pentágono de Formación"
          text="Comparte este informe con el equipo directivo de la empresa para alinear la percepción del estado del talento."
        />
        <StepItem
          number={2}
          title="Definir metas cortas (SMART)"
          text="Prioriza acciones de formación para las dos áreas críticas antes de que afecten los resultados del negocio."
        />
        <StepItem
          number={3}
          title="Sesión de co-diseño curricular"
          text="Agenda una llamada estratégica gratuita con los consultores de Academia Referente para trazar un cronograma detallado de capacitación (modalidad virtual, presencial o híbrida)."
        />

        <View
          style={{
            marginTop: 16,
            backgroundColor: COLORS.bg,
            borderRadius: 10,
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: 700, color: COLORS.textLight }}>
            Agenda una llamada con Academia Referente
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 6 }}>academiareferentes.com</Text>
          <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 2 }}>{CONTACT_EMAIL}</Text>
          <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 2 }}>
            {CONTACT_PHONE} — llamadas y WhatsApp
          </Text>
        </View>

        <PageFooter page={6} />
      </Page>
    </Document>
  );
}
