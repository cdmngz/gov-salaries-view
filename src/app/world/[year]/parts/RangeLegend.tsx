// src/app/world/[year]/parts/RangeLegend.tsx

import {
  rangeColorByValue,
  type RangeValue,
} from "@/app/world/[year]/table/types";
import { cn } from "@/lib/utils";

export function RangeLegend() {
  const items: Array<[RangeValue, string]> = [
    [1, "Left"],
    [2, "Left-center"],
    [3, "Center"],
    [4, "Right-center"],
    [5, "Right"],
  ];

  return (
    <div
      className="flex flex-wrap justify-end items-center gap-2 text-xs text-muted-foreground"
      data-testid="range-legend"
    >
      {items.map(([val, label]) => (
        <div
          key={val}
          className="flex items-center gap-1"
          data-testid={`legend-${label}`}
        >
          <div className={cn("size-3 rounded-full", rangeColorByValue[val])} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
