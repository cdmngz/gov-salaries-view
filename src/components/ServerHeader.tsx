// src/components/ServerHeader.tsx

import Link from "next/link";

import HeaderControlsClient from "@/components/HeaderControlsClient";
import type { CountryCode } from "@/types";
import { components } from "@/types/openapi";

type Props = {
  country: CountryCode;
  year: number;
  currency: string;
  baseCurrency: string;
  rates: components["schemas"]["Rates"] | null;
  periods: number[];
};

export default function ServerHeader({
  country,
  year,
  currency,
  baseCurrency,
  rates,
  periods,
}: Props) {
  const latestAvailableYear = periods.length > 0 ? Math.max(...periods) : year;

  return (
    <header className="w-full flex flex-wrap items-center justify-between z-10 sticky top-0 p-4 shadow bg-background">
      <Link
        href={`/world/${latestAvailableYear}`}
        className="text-lg select-none flex items-center gap-2 font-medium transition"
      >
        <span aria-hidden>🏛️</span>
        <span className="truncate font-semibold">Government viewer</span>
      </Link>

      <HeaderControlsClient
        country={country}
        defaultYear={year}
        currency={currency}
        baseCurrency={baseCurrency}
        rates={rates}
        periods={periods}
      />
    </header>
  );
}
