import { cn } from "@/lib/utils";
import { rangeColorByValue, type RangeValue } from "../table/types";

export function RangeDots({ ranges }: { ranges?: RangeValue[] }) {
  if (!ranges?.length) return null;
  return (
    <div className="flex items-center gap-1">
      {ranges.map((r, i) => (
        <div
          key={`${i}-${r}`}
          className={cn(
            "size-3 rounded-full",
            rangeColorByValue[r] ?? "bg-muted"
          )}
          aria-label={`range-${r}`}
          title={`range ${r}`}
        />
      ))}
    </div>
  );
}
