import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface AciScores {
  pps: number;
  dig: number;
  gcc: number;
  wfa: number;
}

interface AciRadarChartProps {
  scores: AciScores;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
}

const AciRadarChart = ({ scores, size = "md", showLabels = true }: AciRadarChartProps) => {
  const data = [
    { subject: "PPS", value: scores.pps, fullMark: 250 },
    { subject: "DIG", value: scores.dig, fullMark: 250 },
    { subject: "GCC", value: scores.gcc, fullMark: 250 },
    { subject: "WFA", value: scores.wfa, fullMark: 250 },
  ];

  const total = scores.pps + scores.dig + scores.gcc + scores.wfa;

  const sizeMap = {
    sm: { w: 120, h: 100 },
    md: { w: 240, h: 200 },
    lg: { w: 360, h: 300 },
  };

  const dims = sizeMap[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ width: dims.w, height: dims.h }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="hsl(var(--border))" />
            {showLabels && (
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: size === "sm" ? 10 : 12 }}
              />
            )}
            <PolarRadiusAxis
              angle={90}
              domain={[0, 250]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="ACI"
              dataKey="value"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            {size !== "sm" && <Tooltip />}
          </RadarChart>
        </ResponsiveContainer>
      </div>
      {showLabels && (
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-sm text-muted-foreground">/ 1000</span>
        </div>
      )}
    </div>
  );
};

export default AciRadarChart;
