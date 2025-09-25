// src/components/ServerHeader.tsx

import Link from "next/link";

import type { CountryCode } from "@/types";
import HeaderControlsClient from "@/components/HeaderControlsClient";
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
  const latestAvailableYear =
    periods.length > 0 ? Math.max(...periods) : year;

  return (
    <header className="w-full z-10 sticky top-0 p-4 bg-background shadow">
      <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/world/${latestAvailableYear}`}
          className="text-lg flex items-center gap-2 font-medium transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span aria-hidden>🏛️</span>
          <span className="truncate">Government viewer</span>
        </Link>

        <HeaderControlsClient
          country={country}
          defaultYear={year}
          currency={currency}
          baseCurrency={baseCurrency}
          rates={rates}
          periods={periods}
        />
      </div>
    </header>
  );
}
