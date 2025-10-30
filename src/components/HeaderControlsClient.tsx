// src/components/HeaderControlsClient.tsx

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
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

type SearchConfig = {
  placeholder?: string;
  emptyMessage?: string;
};

type Option = {
  value: string;
  label: React.ReactNode;
  searchText?: string;
};

function ControlSelect({
  value,
  onChange,
  placeholder,
  options,
  searchConfig,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: Option[];
  searchConfig?: SearchConfig;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchConfig) return options;
    const term = searchTerm.trim().toLowerCase();
    if (!term) return options;
    return options.filter((opt) => {
      const searchTarget = (
        opt.searchText ??
        (typeof opt.label === "string" ? opt.label : opt.value)
      )
        .toString()
        .toLowerCase();
      return searchTarget.includes(term);
    });
  }, [options, searchConfig, searchTerm]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      onOpenChange={(open) => {
        if (!open) setSearchTerm("");
      }}
    >
      <SelectTrigger className="text-sm bg-card rounded-none border-none shadow-none">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={searchConfig ? "max-h-72" : undefined}>
        {searchConfig ? (
          <div className="sticky top-0 z-10 bg-popover p-2 pb-1">
            <Input
              autoFocus
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") return;
                event.stopPropagation();
              }}
              placeholder={searchConfig.placeholder ?? "Search"}
              className="h-8"
            />
          </div>
        ) : null}
        {filteredOptions.length ? (
          filteredOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))
        ) : (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            {searchConfig?.emptyMessage ?? "No results"}
          </div>
        )}
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
  const countries = countriesData;

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

    const toOption = ({
      code,
      label,
      searchText,
    }: (typeof withNames)[number]) => ({
      value: code,
      label,
      searchText,
    });

    return [...pinned.map(toOption), ...rest.map(toOption)];
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
        searchConfig={{
          placeholder: "Search countries",
          emptyMessage: "No countries found",
        }}
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
