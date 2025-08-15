// src/components/HeaderControlsClient.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import countriesData from "@/data/countries.json";
import { LANGUAGE_NAMES } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import type { CountriesData, CountryCode, Rates } from "@/types";
import { Language, LanguageSchema, parseLang } from "@/validators/lang";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ThemeToggle from "./ThemeToggle";

type Props = {
  country: CountryCode;
  currency: string;
  baseCurrency: string;
  rates: Rates | null;
  periods: number[];
  defaultYear: number;
};

export default function HeaderControlsClient({
  country,
  currency,
  baseCurrency,
  rates,
  periods,
  defaultYear,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countries = countriesData as CountriesData;

  const currencyCodes = useMemo(() => {
    const set = new Set<string>();
    if (baseCurrency) set.add(baseCurrency.toUpperCase());
    if (rates?.rates)
      Object.keys(rates.rates).forEach((c) => set.add(c.toUpperCase()));
    return Array.from(set).sort();
  }, [baseCurrency, rates]);

  const years = useMemo(
    () => Array.from(new Set(periods)).sort((a, b) => b - a),
    [periods]
  );

  const updateQuery = (
    updates: Record<string, string>,
    pathnameOverride?: string
  ) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    for (const k in updates) params.set(k, updates[k]);
    const qs = params.toString();
    router.push(
      `${pathnameOverride ?? window.location.pathname}${qs ? `?${qs}` : ""}`
    );
  };

  const currentLang: Language = useMemo(() => {
    return parseLang(searchParams.get("lang"));
  }, [searchParams]);

  const currentCurrency: string = useMemo(() => {
    const q = (searchParams.get("currency") || "").toUpperCase();
    if (q && currencyCodes.includes(q)) return q;
    if (currency && currencyCodes.includes(currency.toUpperCase()))
      return currency.toUpperCase();
    if (baseCurrency && currencyCodes.includes(baseCurrency.toUpperCase()))
      return baseCurrency.toUpperCase();
    return DEFAULT_CURRENCY;
  }, [searchParams, currencyCodes, currency, baseCurrency]);

  return (
    <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
      <Select
        value={country}
        onValueChange={(val) => {
          const qs = searchParams?.toString() ?? "";
          router.push(`/${val}/${defaultYear}${qs ? `?${qs}` : ""}`);
        }}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(countries).map(([code, meta]) => (
            <SelectItem key={code} value={code}>
              {meta.flag} {meta.names[currentLang] ?? code.toUpperCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentLang}
        onValueChange={(val) => updateQuery({ lang: val })}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Lang" />
        </SelectTrigger>
        <SelectContent>
          {LanguageSchema.options.map((code) => (
            <SelectItem key={code} value={code}>
              {LANGUAGE_NAMES[currentLang]?.[code] ?? code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentCurrency}
        onValueChange={(val) => updateQuery({ currency: val })}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Currency">{currentCurrency}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {currencyCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {code} {CURRENCY_SYMBOLS[code] ?? ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={defaultYear.toString()}
        onValueChange={(val) => {
          const qs = searchParams?.toString() ?? "";
          router.push(`/${country}/${val}${qs ? `?${qs}` : ""}`);
        }}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ThemeToggle />
    </div>
  );
}
