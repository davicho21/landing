import { Document, Page, View, Text, StyleSheet, Image, Font } from "@react-pdf/renderer";
import type { AreaCritica, RecommendationResult } from "@/lib/recommendation-engine";
import type { Course } from "@/lib/course-catalog";
import type { DiagnosticAnswers } from "@/lib/types";
import { WHEEL_ASPECTS } from "@/lib/wheel-config";
import { LOGO_LOCKUP_DARK_DATA_URI, LOGO_LOCKUP_LIGHT_DATA_URI } from "@/lib/pdf/logo-assets";
import { RadarChart } from "@/lib/pdf/radar-chart";

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
  urgente: "#dc4545",
  proceso: "#c98a1a",
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
  qaBlock: {
    marginBottom: 10,
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
  if (promedio <= 4) return COLORS.urgente;
  if (promedio <= 7) return COLORS.proceso;
  return COLORS.accent;
}

function tierLabel(promedio: number): string {
  if (promedio <= 4) return "Urgente";
  if (promedio <= 7) return "En proceso";
  return "Excelente";
}

function LogoLockup({ variant, height = 16 }: { variant: "light" | "dark"; height?: number }) {
  const src = variant === "light" ? LOGO_LOCKUP_LIGHT : LOGO_LOCKUP_DARK;
  // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image (PDF output), not an HTML/next <img>; it has no alt prop.
  return <Image src={src} style={{ width: height * LOGO_ASPECT, height }} />;
}

function PageFooter({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Academia Referente — Rueda de Crecimiento Organizacional</Text>
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
    <Document title="Rueda de Crecimiento Organizacional — Academia Referente">
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
              Diagnóstico organizacional
            </Text>
          </View>
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
              <Text style={{ color: COLORS.accent }}>Rueda</Text> de Crecimiento
            </Text>
            <Text style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>Organizacional</Text>
          </View>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Preparado para: {answers.empresa}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Sector: {answers.sector}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Contacto: {answers.email}</Text>
          <Text style={{ fontSize: 12, color: COLORS.muted }}>Fecha: {dateLabel}</Text>
        </View>
        <Text style={{ fontSize: 9, color: COLORS.muted }}>academiareferentes.com</Text>
      </Page>

      {/* Página 2: Sobre el instrumento */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Metodología" title="Cómo leer este informe" />

        <Text style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 14 }}>
          Este diagnóstico está inspirado en la metodología de la &quot;rueda de la vida&quot;, adaptada al
          contexto corporativo. Evalúa ocho áreas críticas que impulsan la competitividad y el bienestar de una
          organización, cada una calificada de 1 a 10 con base en las respuestas de {withoutTrailingPeriod(answers.empresa)}.
        </Text>

        <Text style={styles.sectionTitle}>Escala de medición</Text>
        <View style={styles.scaleRow}>
          <View style={[styles.scaleChip, { backgroundColor: "#fdecec" }]}>
            <Text style={[styles.scaleChipLabel, { color: COLORS.urgente }]}>Urgente</Text>
            <Text style={styles.scaleChipRange}>1 a 4 — requiere atención inmediata</Text>
          </View>
          <View style={[styles.scaleChip, { backgroundColor: "#fbf1e0" }]}>
            <Text style={[styles.scaleChipLabel, { color: COLORS.proceso }]}>En proceso</Text>
            <Text style={styles.scaleChipRange}>5 a 7 — funciona, pero no es óptima</Text>
          </View>
          <View style={[styles.scaleChip, { backgroundColor: "#e3fcef" }]}>
            <Text style={[styles.scaleChipLabel, { color: "#1f8f56" }]}>Excelente</Text>
            <Text style={styles.scaleChipRange}>8 a 10 — fortaleza consolidada</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Las 8 áreas evaluadas</Text>
        <View style={styles.aspectGrid}>
          {WHEEL_ASPECTS.map((aspecto) => (
            <View key={aspecto.id} style={styles.aspectGridItem}>
              <Text style={{ fontSize: 10.5, fontWeight: 700, marginBottom: 2 }}>{aspecto.nombre}</Text>
              <Text style={{ fontSize: 9, color: COLORS.bodyMuted, lineHeight: 1.3 }}>{aspecto.descripcion}</Text>
            </View>
          ))}
        </View>

        <PageFooter page={2} />
      </Page>

      {/* Página 3: La rueda */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Resultado" title="Tu Rueda de Crecimiento Organizacional" />

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

      {/* Página 4: Lectura del resultado */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Interpretación" title="Lectura de tu resultado" />

        <Text style={{ fontSize: 12, lineHeight: 1.5, marginBottom: 16 }}>{forma.mensaje}</Text>

        <Text style={styles.sectionTitle}>Áreas críticas identificadas</Text>
        <Text style={{ fontSize: 10.5, color: COLORS.bodyMuted, lineHeight: 1.4, marginBottom: 10 }}>
          Estas son las 2 áreas con menor puntaje. Recomendamos partir de aquí con metas SMART a corto plazo
          para elevar su desempeño.
        </Text>
        {areasCriticas.map((area, index) => (
          <AreaCriticaCard key={area.aspecto.id} area={area} orden={index + 1} />
        ))}

        <PageFooter page={4} />
      </Page>

      {/* Página 5: Rutas de formación recomendadas */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Recomendación" title="Rutas de formación sugeridas" />

        {areasCriticas.map((area, index) => (
          <View key={area.aspecto.id} wrap={false}>
            <View style={[styles.card, { backgroundColor: COLORS.bg, marginTop: index === 0 ? 0 : 6 }]}>
              <View style={[styles.cardBar, { backgroundColor: tierColor(area.promedio) }]} />
              <View style={styles.cardBody}>
                <Text style={{ fontSize: 13, fontWeight: 700, color: COLORS.textLight, marginBottom: 4 }}>
                  {area.track.nombre}
                </Text>
                <Text style={{ fontSize: 10.5, color: COLORS.muted, lineHeight: 1.4 }}>{area.track.descripcion}</Text>
              </View>
            </View>

            <CourseCard course={area.cursoPrincipal} accentColor={COLORS.accent} />
            {area.cursosComplementarios.map((curso) => (
              <CourseCard key={curso.id} course={curso} accentColor={COLORS.accent2} />
            ))}
          </View>
        ))}

        <PageFooter page={5} />
      </Page>

      {/* Página 6: Próximos pasos */}
      <Page size="A4" style={styles.bodyPage}>
        <BodyPageHeader eyebrow="Siguiente paso" title="Cómo avanzar con Academia Referente" />

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

        <Text style={styles.sectionTitle}>Plan de mejora sugerido</Text>
        <StepItem
          number={1}
          title="Comparte esta rueda con tu equipo directivo"
          text="Discutan juntos los picos (fortalezas) y valles (riesgos) que muestra la figura."
        />
        <StepItem
          number={2}
          title="Define metas SMART para las 2 áreas críticas"
          text="Trabájenlas en una sesión de lluvia de ideas con el equipo involucrado en cada área."
        />
        <StepItem
          number={3}
          title="Agenda una llamada con Academia Referente"
          text="Te ayudamos a convertir este diagnóstico en una ruta de formación con cronograma y modalidad definidos."
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
            Escríbenos y sigamos la conversación
          </Text>
          <Text style={{ fontSize: 10, color: COLORS.accent, marginTop: 2 }}>academiareferentes.com</Text>
        </View>

        <PageFooter page={6} />
      </Page>
    </Document>
  );
}
