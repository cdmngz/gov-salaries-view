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
  rates: components["schemas"]["WorldRates"] | null;
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
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link
          href={`/world/${latestAvailableYear}`}
          className="text-lg select-none font-light"
        >
          <span>Government View</span>
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
