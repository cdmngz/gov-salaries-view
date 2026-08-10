// src/lib/map-colors.ts

import countriesJson from "@/data/countries.json";
import type { Language } from "@/validators/lang";

export type CountriesRecord = Record<
  string,
  (typeof countriesJson)[keyof typeof countriesJson]
>;

export const countriesRecord = countriesJson as CountriesRecord;

export const GEO_URL = "/maps/world_countries.topojson";

export type RangeValue = 1 | 2 | 3 | 4 | 5;

export type DataShape = Record<
  string,
  {
    countryName?: string;
    partyRangeStatsSplit?: {
      executive?: { mostPopularRanges?: number[] };
      rest?: { mostPopularRanges?: number[] };
    };
    partyRangeStats?: { mostPopularRanges?: number[] };
  }
>;

export type Wing =
  | "left"
  | "left-center"
  | "center"
  | "right-center"
  | "right"
  | "empty";

export const HEX_BY_RANGE: Record<RangeValue, string> = {
  1: "#f87171",
  2: "#fecaca",
  3: "#d1d5db",
  4: "#bfdbfe",
  5: "#60a5fa",
};

export const RANGE_LABELS: Record<RangeValue, string> = {
  1: "Left",
  2: "Left-center",
  3: "Center",
  4: "Right-center",
  5: "Right",
};

function mostExtreme(values?: number[]) {
  if (!values?.length) return undefined;
  let e = values[0],
    dmax = Math.abs(e - 3);
  for (const v of values) {
    const d = Math.abs(v - 3);
    if (d > dmax || (d === dmax && (v === 1 || v === 5))) {
      e = v;
      dmax = d;
    }
  }
  return (e >= 1 && e <= 5 ? e : undefined) as RangeValue | undefined;
}

function rangeToWing(n?: RangeValue): Wing {
  return n === 1
    ? "left"
    : n === 2
    ? "left-center"
    : n === 3
    ? "center"
    : n === 4
    ? "right-center"
    : n === 5
    ? "right"
    : "empty";
}

export function shade(hex: string, percent: number) {
  let R = parseInt(hex.slice(1, 3), 16);
  let G = parseInt(hex.slice(3, 5), 16);
  let B = parseInt(hex.slice(5, 7), 16);
  R = Math.min(255, Math.max(0, R + Math.round((percent / 100) * 255)));
  G = Math.min(255, Math.max(0, G + Math.round((percent / 100) * 255)));
  B = Math.min(255, Math.max(0, B + Math.round((percent / 100) * 255)));
  const h = (n: number) => n.toString(16).padStart(2, "0");
  return `#${h(R)}${h(G)}${h(B)}`;
}

export function localizedName(iso2: string, lang: Language) {
  const key = iso2.toLowerCase();
  const meta = (countriesJson as CountriesRecord)[key];
  return meta?.names?.[lang] ?? meta?.names?.en ?? iso2.toUpperCase();
}

export function buildIso2Map(data: DataShape, lang: Language) {
  const m = new Map<string, { wing: Wing; range?: RangeValue; name: string }>();
  for (const [code, v] of Object.entries(data || {})) {
    const ranges =
      v.partyRangeStatsSplit?.executive?.mostPopularRanges ??
      v.partyRangeStats?.mostPopularRanges ??
      v.partyRangeStatsSplit?.rest?.mostPopularRanges ??
      [];
    const extreme = mostExtreme(ranges);
    const wing = rangeToWing(extreme);
    const iso2 = code.toUpperCase();
    m.set(iso2, {
      wing,
      range: extreme,
      name: v.countryName || localizedName(iso2, lang),
    });
  }
  return m;
}

export function rangeCounts(data: DataShape): Record<RangeValue, number> {
  const counts: Record<RangeValue, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  for (const v of Object.values(data || {})) {
    const ranges =
      v.partyRangeStatsSplit?.executive?.mostPopularRanges ??
      v.partyRangeStats?.mostPopularRanges ??
      v.partyRangeStatsSplit?.rest?.mostPopularRanges ??
      [];

    const extreme = mostExtreme(ranges);
    if (extreme) counts[extreme] += 1;
  }

  return counts;
}

export function fillForIso2(
  byIso2: Map<string, { wing: Wing; range?: RangeValue }>,
  iso2?: string
) {
  const key = (iso2 || "").toUpperCase();
  const rec = byIso2.get(key);
  if (!rec || !rec.range) return "#ffffff";
  return HEX_BY_RANGE[rec.range];
}
