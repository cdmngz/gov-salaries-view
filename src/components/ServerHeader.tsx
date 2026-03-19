// src/components/ServerHeader.tsx

import { BarChart3, Globe2 } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            href={`/world/${latestAvailableYear}`}
            className="group inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-3 py-2 shadow-sm transition hover:border-primary/25 hover:bg-background"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <BarChart3 className="size-4.5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight sm:text-base">
                Government View
              </span>
              <span className="text-xs text-muted-foreground">
                Compensation intelligence for public offices
              </span>
            </span>
          </Link>

          <div className="hidden rounded-full border border-border/60 bg-background/70 px-3 py-2 text-xs text-muted-foreground md:inline-flex md:items-center md:gap-2">
            <Globe2 className="size-3.5" />
            {country.toUpperCase()} · {year}
          </div>
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
