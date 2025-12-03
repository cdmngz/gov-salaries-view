"use client";
import { RangeLegend, type LegendCounts } from "../parts/RangeLegend";

export default function MapLegend({ counts }: { counts?: LegendCounts }) {
  return (
    <RangeLegend counts={counts} shape="square" className="mt-3 gap-3" />
  );
}
