// src/components/ServerHeader.tsx

import { BarChart3 } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/65">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:justify-start">
          <Link
            href={`/world/${latestAvailableYear}`}
            className="group inline-flex items-center gap-3 rounded-full px-1 py-1 transition hover:text-primary"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="size-4.5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight sm:text-base">
                Government View
              </span>
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Compensation intelligence for public offices
              </span>
            </span>
          </Link>
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
