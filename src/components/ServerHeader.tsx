// src/components/ServerHeader.tsx

import type { CountryCode, Rates } from "@/types";
import HeaderControlsClient from "./HeaderControlsClient";

type Props = {
  country: CountryCode;
  year: number;
  currency: string; // initial value
  baseCurrency: string; // from data.json
  rates: Rates | null; // from rates.json (null in fallback)
  periods: { year: number }[]; // available years
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
    <header className="w-full p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow">
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
