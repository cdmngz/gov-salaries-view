// src/components/ServerHeader.tsx

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
  return (
    <header className="w-full z-10 sticky top-0 p-4 bg-background shadow">
      <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span aria-hidden>🏛️</span>
          <span className="truncate">Government viewer</span>
        </div>

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
