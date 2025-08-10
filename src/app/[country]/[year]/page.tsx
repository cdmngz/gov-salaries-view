// src/app/[country]/[year]/page.tsx

import ServerHeader from "@/components/ServerHeader";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import {
  fetchAvailableCountries,
  fetchCountryData,
  fetchCountryPeriods,
} from "@/lib/data";
import type { CountryCode } from "@/types";
import ClientView from "./ClientView";
import ServerFooter from "@/components/ServerFooter";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();
  const combos = await Promise.all(
    countries.map(async (country: CountryCode) => {
      const periods = await fetchCountryPeriods(country);
      const years = Array.from(new Set(periods.map((p) => p.year)));
      return years.map((y) => ({ country, year: String(y) }));
    })
  );
  return combos.flat();
}

export default async function Page({
  params,
}: {
  params: Promise<{ country: CountryCode; year: string }>;
}) {
  const { country, year } = await params;

  const periods = await fetchCountryPeriods(country);
  const { data: json, rates } = await fetchCountryData(country, Number(year));
  const baseCurrency = json.baseCurrency;

  return (
    <div className="min-h-screen flex flex-col">
      <ServerHeader
        country={country}
        year={Number(year)}
        currency={baseCurrency || DEFAULT_CURRENCY}
        baseCurrency={baseCurrency}
        rates={rates}
        periods={periods}
      />
      <main className="flex-1 p-6">
        <ClientView json={json} rates={rates} baseCurrency={baseCurrency} />
      </main>
      <ServerFooter />
    </div>
  );
}
