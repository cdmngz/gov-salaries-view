"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import type { Rates } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import ThemeToggle from "./ThemeToggle";

export default function WorldHeaderClient({
  defaultYear,
  years,
  rates,
}: {
  defaultYear: number;
  years: number[];
  rates: Rates | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currencyCodes = useMemo(() => {
    const set = new Set<string>(["USD"]);
    if (rates?.rates)
      Object.keys(rates.rates).forEach((c) => set.add(c.toUpperCase()));
    return Array.from(set).sort();
  }, [rates]);

  const currentCurrency = useMemo(() => {
    const q = (searchParams.get("currency") || "").toUpperCase();
    if (q && currencyCodes.includes(q)) return q;
    return DEFAULT_CURRENCY; // budgets/GDP are normalized to USD
  }, [searchParams, currencyCodes]);

  const updateQuery = (updates: Record<string, string>, pathname?: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    for (const k in updates) params.set(k, updates[k]);
    router.push(`${pathname ?? window.location.pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3">
      <Select
        value={currentCurrency}
        onValueChange={(val) => updateQuery({ currency: val })}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-w-[120px]">
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
          router.push(`/world/${val}${qs ? `?${qs}` : ""}`);
        }}
      >
        <SelectTrigger className="h-9 px-3 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-w-[120px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years
            .slice()
            .sort((a, b) => b - a)
            .map((y) => (
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
