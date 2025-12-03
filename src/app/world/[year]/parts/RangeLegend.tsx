// src/app/world/[year]/parts/RangeLegend.tsx

import { HEX_BY_RANGE, RANGE_LABELS, type RangeValue } from "@/lib/map-colors";
import { cn } from "@/lib/utils";

const ITEMS: Array<{ value: RangeValue; label: string; color: string }> = (
  [1, 2, 3, 4, 5] as const
).map((value) => ({ value, label: RANGE_LABELS[value], color: HEX_BY_RANGE[value] }));

export type LegendCounts = Partial<Record<RangeValue, number>>;

export function RangeLegend({
  counts,
  shape = "circle",
  className,
}: {
  counts?: LegendCounts;
  shape?: "circle" | "square";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className
      )}
      data-testid="range-legend"
    >
      {ITEMS.map(({ value, label, color }) => (
        <div
          key={value}
          className="flex items-center gap-1"
          data-testid={`legend-${label}`}
        >
          <div
            className={cn("size-3 border", shape === "circle" ? "rounded-full" : "rounded-sm")}
            style={{ backgroundColor: color }}
          />
          <span>
            {label}
            {counts ? ` (${counts[value] ?? 0})` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
