import type { FilterFn } from "@tanstack/react-table";
import type { LegacyFeatures } from "@tanstack/react-table/legacy";
import {
  WING_FILTER_VALUE_TO_RANGE,
  isRangeValue,
  type Row,
  type RangeValue,
  type WingFilterSelection,
  type WingFilterValue,
} from "@/app/world/[year]/table/types";

const isWingFilterSelection = (v: unknown): v is WingFilterSelection =>
  Array.isArray(v) &&
  v.every(
    (x): x is WingFilterValue =>
      typeof x === "string" && x in WING_FILTER_VALUE_TO_RANGE
  );

export const wingRangeFilter: FilterFn<LegacyFeatures, Row> = (
  row,
  columnId,
  filterValue
) => {
  if (!isWingFilterSelection(filterValue) || filterValue.length === 0)
    return true;

  const raw = row.getValue<unknown>(columnId);
  if (!Array.isArray(raw)) return false;

  const ranges = (raw as unknown[]).filter(
    (n): n is RangeValue => typeof n === "number" && isRangeValue(n)
  );
  if (ranges.length === 0) return false;

  const expected = new Set<RangeValue>(
    filterValue.map((v) => WING_FILTER_VALUE_TO_RANGE[v])
  );

  return ranges.some((r) => expected.has(r));
};
