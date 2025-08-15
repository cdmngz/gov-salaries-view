// src/components/Header.tsx

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_NAMES } from "@/i18n";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import type { CountriesData, CountryCode, Rates } from "@/types";
import { Language, LanguageSchema } from "@/validators/lang";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import countriesData from "../data/countries.json";
import ThemeToggle from "./ThemeToggle";

export default function Header({
  country,
  currency,
  baseCurrency,
  rates,
  periods,
  year: defaultYear,
  lang,
}: {
  country: CountryCode;
  currency: string;
  baseCurrency: string;
  rates: Rates | null;
  periods: { year: number }[];
  year: number;
  lang: Language;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countries: CountriesData = countriesData;

  const currencyCodes = useMemo(() => {
    const set = new Set<string>();
    if (baseCurrency) set.add(baseCurrency);
    if (rates) Object.keys(rates.rates).forEach(set.add, set);
    return Array.from(set);
  }, [baseCurrency, rates]);

  const years = useMemo(() => {
    return Array.from(new Set(periods.map((p) => p.year))).sort(
      (a, b) => b - a
    );
  }, [periods]);

  const onChangeParams = (
    updates: Record<string, string>,
    pathnameOverride?: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key in updates) params.set(key, updates[key]);
    router.push(
      `${pathnameOverride ?? window.location.pathname}?${params.toString()}`
    );
  };

  return (
    <header className="w-full p-4 flex flex-wrap items-center justify-between bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow">
      <div className="text-lg flex items-center gap-2 font-medium">
        <span role="img">🏛️</span> Government viewer
      </div>

      <div className="flex items-center flex-wrap justify-center gap-4">
        {/* Country */}
        <Select
          value={country}
          onValueChange={(val) => {
            router.push(`/${val}/${defaultYear}?${searchParams.toString()}`);
          }}
        >
          <SelectTrigger className="p-2 text-sm font-medium border-none">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(countries).map(([code, meta]) => (
              <SelectItem key={code} value={code}>
                {meta.flag} {meta.names[lang] ?? code.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Language */}
        <Select
          value={lang}
          onValueChange={(val) => onChangeParams({ lang: val })}
        >
          <SelectTrigger className="p-2 text-sm font-medium border-none">
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent>
            {LanguageSchema.options.map((code) => (
              <SelectItem key={code} value={code}>
                {LANGUAGE_NAMES[lang]?.[code] ?? code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Currency */}
        <Select
          value={currency}
          onValueChange={(val) => onChangeParams({ currency: val })}
        >
          <SelectTrigger className="p-2 text-sm font-medium border-none">
            <SelectValue placeholder="Currency">{currency}</SelectValue>
          </SelectTrigger>

          <SelectContent>
            {currencyCodes.map((code) => (
              <SelectItem key={code} value={code}>
                {code} {CURRENCY_SYMBOLS[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={defaultYear.toString()}
          onValueChange={(val) =>
            router.push(`/${country}/${val}?${searchParams.toString()}`)
          }
        >
          <SelectTrigger className="p-2 text-sm font-medium border-none">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <ThemeToggle />
      </div>
    </header>
  );
}
