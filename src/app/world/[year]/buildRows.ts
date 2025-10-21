// src/app/world/[year]/buildRows.ts

import { DEFAULT_CURRENCY } from "@/lib/constants";
import { convert } from "@/lib/utils";
import type { components } from "@/types/openapi";
import type { Row, RangeValue } from "./table/types";
import { isRangeValue } from "./table/types";
import type { Language } from "@/validators/lang";
import { countriesRecord } from "@/lib/map-colors";

export function buildRows(
  data: components["schemas"]["WorldData"],
  currency: string,
  rates: components["schemas"]["Rates"]["rates"],
  lang: Language
): Row[] {
  return Object.entries(data).map(([code, stats]) => {
    const normalizedCode = code.toLowerCase();
    const countryMeta = countriesRecord[normalizedCode];
    const hasCountryPage = Boolean(countryMeta);
    const codeLabel = code.toUpperCase();
    const displayName =
      countryMeta?.names?.[lang] ?? countryMeta?.names?.en ?? codeLabel;
    const flag = countryMeta?.flag ?? null;

    const executiveRange = (
      stats.partyRangeStatsSplit?.executive?.mostPopularRanges ?? []
    ).filter(isRangeValue) as RangeValue[];
    const restRange = (
      stats.partyRangeStatsSplit?.rest?.mostPopularRanges ?? []
    ).filter(isRangeValue) as RangeValue[];

    const minAnnualSalary = convert(
      stats.minAnnualSalary,
      DEFAULT_CURRENCY,
      currency,
      rates
    );
    const gdp = convert(stats.GDP, DEFAULT_CURRENCY, currency, rates);
    const gdpPerCapita = convert(
      stats.GDPPerCapita,
      DEFAULT_CURRENCY,
      currency,
      rates
    );
    const budget = convert(
      stats.ministers.budget,
      DEFAULT_CURRENCY,
      currency,
      rates
    );
    const gdpPercent = gdp ? (budget * 100) / gdp : 0;

    const ministersQty = stats.ministers.quantity;
    const deputiesQty = stats.deputies.quantity;
    const senateQty = stats.senate.quantity;

    return {
      code: normalizedCode,
      codeLabel,
      displayName,
      flag,
      hasCountryPage,
      executiveRange,
      restRange,
      ministersQty,
      budget,
      minAnnualSalary,
      gdp,
      gdpPerCapita,
      gdpPercent,
      deputiesQty,
      senateQty,
      countryName: `${displayName} ${codeLabel}`,
      total: ministersQty + deputiesQty + senateQty,
    };
  });
}
