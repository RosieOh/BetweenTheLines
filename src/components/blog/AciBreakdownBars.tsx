import { pillars } from "@/lib/categoryConfig";
import type { AciBreakdown } from "@/data/posts";

interface AciBreakdownBarsProps {
  breakdown: AciBreakdown;
  size?: "sm" | "md";
}

const AciBreakdownBars = ({ breakdown, size = "md" }: AciBreakdownBarsProps) => (
  <div className="flex flex-col gap-3">
    {pillars.map((p) => {
      const score = breakdown[p.key];
      const pct = Math.round((score / 250) * 100);
      return (
        <div key={p.key}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className={`rounded-full flex-shrink-0 ${p.color} ${size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2"}`} />
              <span className={`font-semibold text-muted-foreground ${size === "sm" ? "text-[11px]" : "text-[12px]"}`}>
                {p.label}
              </span>
              {size === "md" && (
                <span className="text-[11px] text-muted-foreground hidden sm:inline">
                  {p.fullName}
                </span>
              )}
            </div>
            <span className={`font-bold text-foreground tabular-nums ${size === "sm" ? "text-[11px]" : "text-[13px]"}`}>
              {score}
              <span className={`font-normal text-muted-foreground ${size === "sm" ? "text-[10px]" : "text-[11px]"}`}>
                /250
              </span>
            </span>
          </div>
          <div className={`bg-border rounded-full overflow-hidden ${size === "sm" ? "h-1" : "h-1.5"}`}>
            <div
              className={`h-full ${p.color} rounded-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default AciBreakdownBars;
