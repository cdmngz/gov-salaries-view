"use client";
import { HEX_BY_RANGE } from "@/lib/map-colors";

export default function MapLegend() {
  const items = [
    { label: "Left", hex: HEX_BY_RANGE[1] },
    { label: "Left-center", hex: HEX_BY_RANGE[2] },
    { label: "Center", hex: HEX_BY_RANGE[3] },
    { label: "Right-center", hex: HEX_BY_RANGE[4] },
    { label: "Right", hex: HEX_BY_RANGE[5] },
    { label: "No data", hex: "#ffffff" },
  ];
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rounded-sm border"
            style={{ backgroundColor: it.hex }}
          />
          <span className="text-xs text-muted-foreground">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
