import { Svg, Polygon, Line, Circle, Text, G } from "@react-pdf/renderer";
import type { ComponentType } from "react";
import type { AspectScore } from "@/lib/recommendation-engine";

// @react-pdf/renderer's SVG <Text> supports fontSize/fontWeight at runtime
// (read directly from node.props in @react-pdf/layout), but its TypeScript
// types omit them from SVGTextProps. This wrapper restores the missing types
// instead of casting to `any` at every call site.
type SvgTextProps = {
  x: number;
  y: number;
  fontSize: number;
  fontWeight?: number;
  fill: string;
  textAnchor: "start" | "middle" | "end";
  children: string;
};

const SvgText = Text as unknown as ComponentType<SvgTextProps>;

const SIZE = 440;
const CENTER = SIZE / 2;
const MAX_RADIUS = 112;
const RINGS = [0.2, 0.4, 0.6, 0.8, 1];

const COLOR_GRID = "#dfe3ee";
const COLOR_AXIS_LABEL = "#111a30";
const COLOR_DATA_STROKE = "#2f8f5f";
const COLOR_DATA_FILL = "#6fffb0";

function pointAt(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function polygonPoints(radiusForIndex: (index: number) => number, count: number): string {
  return Array.from({ length: count }, (_, i) => {
    const angle = -90 + i * (360 / count);
    const { x, y } = pointAt(angle, radiusForIndex(i));
    return `${x},${y}`;
  }).join(" ");
}

export function RadarChart({ aspectScores }: { aspectScores: AspectScore[] }) {
  const count = aspectScores.length;

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {RINGS.map((ring) => (
        <Polygon
          key={ring}
          points={polygonPoints(() => MAX_RADIUS * ring, count)}
          stroke={COLOR_GRID}
          strokeWidth={1}
          fill="none"
        />
      ))}

      {aspectScores.map((_, i) => {
        const angle = -90 + i * (360 / count);
        const outer = pointAt(angle, MAX_RADIUS);
        return (
          <Line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={outer.x}
            y2={outer.y}
            stroke={COLOR_GRID}
            strokeWidth={1}
          />
        );
      })}

      <Polygon
        points={polygonPoints((i) => MAX_RADIUS * (aspectScores[i].promedio / 10), count)}
        stroke={COLOR_DATA_STROKE}
        strokeWidth={2}
        fill={COLOR_DATA_FILL}
        fillOpacity={0.4}
      />

      {aspectScores.map((score, i) => {
        const angle = -90 + i * (360 / count);
        const point = pointAt(angle, MAX_RADIUS * (score.promedio / 10));
        return <Circle key={i} cx={point.x} cy={point.y} r={3.2} fill={COLOR_DATA_STROKE} />;
      })}

      {aspectScores.map((score, i) => {
        const angle = -90 + i * (360 / count);
        const anchor = pointAt(angle, MAX_RADIUS + 22);
        const cosValue = Math.cos((angle * Math.PI) / 180);
        const sinValue = Math.sin((angle * Math.PI) / 180);
        const textAnchor: "start" | "middle" | "end" =
          cosValue > 0.3 ? "start" : cosValue < -0.3 ? "end" : "middle";
        // Labels stack vertically (label above, score below) at every angle
        // instead of following the radial axis — on horizontal axes the two
        // would otherwise land side by side and overlap.
        const verticalNudge = sinValue > 0.3 ? 4 : sinValue < -0.3 ? -4 : 0;

        return (
          <G key={i}>
            <SvgText
              x={anchor.x}
              y={anchor.y + verticalNudge - 3}
              fontSize={9}
              fontWeight={700}
              fill={COLOR_AXIS_LABEL}
              textAnchor={textAnchor}
            >
              {score.aspecto.nombreCorto}
            </SvgText>
            <SvgText
              x={anchor.x}
              y={anchor.y + verticalNudge + 9}
              fontSize={8}
              fill={COLOR_DATA_STROKE}
              textAnchor={textAnchor}
            >
              {score.promedio.toFixed(1)}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}
