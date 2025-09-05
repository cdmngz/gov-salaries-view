// src/components/HeaderControlsClient.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import ThemeToggle from "@/components/ThemeToggle";
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
import { sortBy } from "@/lib/utils";
import type { CountriesData, CountryCode } from "@/types";
import { components } from "@/types/openapi";
import { Language, LanguageSchema, parseLang } from "@/validators/lang";

type Props = {
  country: CountryCode;
  currency: string;
  baseCurrency: string;
  rates: components["schemas"]["Rates"] | null;
  periods: number[];
  defaultYear: number;
};

type Option = { value: string; label: React.ReactNode };

function ControlSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: Option[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="text-sm bg-card rounded-none border-none shadow-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

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

  const currentLang: Language = useMemo(
    () => parseLang(searchParams.get("lang")),
    [searchParams]
  );

  const currentCurrency: string = useMemo(() => {
    const q = (searchParams.get("currency") || "").toUpperCase();
    if (q && currencyCodes.includes(q)) return q;
    if (currency && currencyCodes.includes(currency.toUpperCase()))
      return currency.toUpperCase();
    if (baseCurrency && currencyCodes.includes(baseCurrency.toUpperCase()))
      return baseCurrency.toUpperCase();
    return DEFAULT_CURRENCY;
  }, [searchParams, currencyCodes, currency, baseCurrency]);

  const countryOptions = useMemo<Option[]>(() => {
    const withNames = Object.entries(countries).map(([code, meta]) => ({
      code,
      name: meta.names[currentLang] ?? code.toUpperCase(),
      label: (
        <>
          {meta.flag} {meta.names[currentLang] ?? code.toUpperCase()}
        </>
      ),
    }));
    const sorted = sortBy(withNames, "name", currentLang);
    return sorted.map(({ code, label }) => ({ value: code, label }));
  }, [countries, currentLang]);

  const languageOptions = useMemo<Option[]>(
    () =>
      LanguageSchema.options.map((code) => ({
        value: code,
        label: LANGUAGE_NAMES[currentLang]?.[code] ?? code,
      })),
    [currentLang]
  );

  const currencyOptions = useMemo<Option[]>(
    () =>
      currencyCodes.map((code) => ({
        value: code,
        label: (
          <>
            {code} {CURRENCY_SYMBOLS[code] ?? ""}
          </>
        ),
      })),
    [currencyCodes]
  );

  const yearOptions = useMemo<Option[]>(
    () => years.map((y) => ({ value: String(y), label: y })),
    [years]
  );

  return (
    <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
      <ControlSelect
        value={country}
        onChange={(val) => {
          const qs = searchParams?.toString() ?? "";
          router.push(`/${val}/${defaultYear}${qs ? `?${qs}` : ""}`);
        }}
        placeholder="Country"
        options={countryOptions}
      />

      <ControlSelect
        value={currentLang}
        onChange={(val) => updateQuery({ lang: val })}
        placeholder="Lang"
        options={languageOptions}
      />

      <ControlSelect
        value={currentCurrency}
        onChange={(val) => updateQuery({ currency: val })}
        placeholder="Currency"
        options={currencyOptions}
      />

      <ControlSelect
        value={String(defaultYear)}
        onChange={(val) => {
          const qs = searchParams?.toString() ?? "";
          router.push(`/${country}/${val}${qs ? `?${qs}` : ""}`);
        }}
        placeholder="Year"
        options={yearOptions}
      />

      <ThemeToggle />
    </div>
  );
}
