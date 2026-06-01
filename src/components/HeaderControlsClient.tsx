// src/components/HeaderControlsClient.tsx

"use client";

import { CalendarRange, Coins, Languages, MapPinned } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import SearchableCombobox from "@/components/SearchableCombobox";
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
import type { CountryCode } from "@/types";
import { components } from "@/types/openapi";
import { Language, LanguageSchema, parseLang } from "@/validators/lang";

type Props = {
  country: CountryCode;
  currency: string;
  baseCurrency: string;
  rates: components["schemas"]["WorldRates"] | null;
  periods: number[];
  defaultYear: number;
};

const triggerClassName =
  "h-10 w-full rounded-full border-0 bg-muted/55 px-4 text-sm shadow-none transition hover:bg-muted/80 sm:min-w-[116px] sm:w-auto";

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
  const countries = countriesData;

  const currencyCodes = useMemo(() => {
    const set = new Set<string>();
    if (baseCurrency) set.add(baseCurrency.toUpperCase());
    if (rates?.rates) {
      Object.keys(rates.rates).forEach((c) => set.add(c.toUpperCase()));
    }
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
    if (currency && currencyCodes.includes(currency.toUpperCase())) {
      return currency.toUpperCase();
    }
    if (baseCurrency && currencyCodes.includes(baseCurrency.toUpperCase())) {
      return baseCurrency.toUpperCase();
    }
    return DEFAULT_CURRENCY;
  }, [searchParams, currencyCodes, currency, baseCurrency]);

  const countryOptions = useMemo(() => {
    const withNames = Object.entries(countries).map(([code, meta]) => ({
      code,
      name: meta.names[currentLang] ?? code.toUpperCase(),
      searchText: Array.from(
        new Set([
          code,
          code.toUpperCase(),
          ...(meta.names ? Object.values(meta.names) : []),
        ])
      ).join(" "),
      label: (
        <>
          {meta.flag} {meta.names[currentLang] ?? code.toUpperCase()}
        </>
      ),
    }));

    const pinnedOrder = ["world", "europe"];
    const pinned = pinnedOrder
      .map((p) => withNames.find((c) => c.code === p))
      .filter(Boolean) as typeof withNames;

    const rest = withNames
      .filter((c) => !pinnedOrder.includes(c.code))
      .sort((a, b) => a.name.localeCompare(b.name, currentLang));

    return [...pinned, ...rest].map(({ code, label, searchText }) => ({
      value: code,
      label,
      searchText,
    }));
  }, [countries, currentLang]);

  const languageOptions = useMemo(
    () =>
      LanguageSchema.options.map((code) => ({
        value: code,
        label: LANGUAGE_NAMES[currentLang]?.[code] ?? code,
        searchText: LANGUAGE_NAMES[currentLang]?.[code] ?? code,
      })),
    [currentLang]
  );

  const currencyOptions = useMemo(
    () =>
      currencyCodes.map((code) => ({
        value: code,
        label: (
          <>
            {code} {CURRENCY_SYMBOLS[code] ?? ""}
          </>
        ),
        searchText: `${code} ${CURRENCY_SYMBOLS[code] ?? ""}`,
      })),
    [currencyCodes]
  );

  const yearOptions = useMemo(
    () =>
      years.map((y) => ({
        value: String(y),
        label: y,
        searchText: String(y),
      })),
    [years]
  );

  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <div className="flex w-full items-center gap-2 rounded-full bg-muted/55 px-2 py-1 transition hover:bg-muted/80 sm:min-w-[240px] sm:flex-1 lg:flex-none">
        <span className="flex size-8 items-center justify-center rounded-full text-muted-foreground">
          <MapPinned className="size-4" />
        </span>
        <SearchableCombobox
          value={country}
          onChange={(val) => {
            const qs = searchParams?.toString() ?? "";
            router.push(`/${val}/${defaultYear}${qs ? `?${qs}` : ""}`);
          }}
          placeholder="Country"
          options={countryOptions}
          searchConfig={{
            placeholder: "Search countries",
            emptyMessage: "No countries found",
          }}
        />
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={currentLang}
          onValueChange={(val) => updateQuery({ lang: val })}
        >
          <SelectTrigger className={triggerClassName}>
            <Languages className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Lang" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={currentCurrency}
          onValueChange={(val) => updateQuery({ currency: val })}
        >
          <SelectTrigger className={triggerClassName}>
            <Coins className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-auto">
        <Select
          value={String(defaultYear)}
          onValueChange={(val) => {
            const qs = searchParams?.toString() ?? "";
            router.push(`/${country}/${val}${qs ? `?${qs}` : ""}`);
          }}
        >
          <SelectTrigger className={triggerClassName}>
            <CalendarRange className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end sm:justify-start">
        <ThemeToggle />
      </div>
    </div>
  );
}
