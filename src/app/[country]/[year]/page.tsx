// src/app/[country]/[year]/page.tsx

import ServerHeader from "@/components/ServerHeader";
import countriesJson from "@/data/countries.json";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import {
  fetchAvailableCountries,
  fetchCountryData,
  fetchCountryPeriods,
} from "@/lib/data";
import type { CountryCode } from "@/types";
import { parseLang } from "@/validators/lang";
import { Metadata } from "next";
import ClientView from "./ClientView";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();
  const combos = await Promise.all(
    countries.map(async (country: CountryCode) => {
      const years = await fetchCountryPeriods(country);
      return years.map((y) => ({ country, year: String(y) }));
    })
  );
  return combos.flat();
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ country: CountryCode; year: string }>;
  searchParams: Promise<{ lang?: string; currency?: string }>;
}): Promise<Metadata> {
  const { country, year } = await params;
  const { lang: langParam } = await searchParams;

  const lang = parseLang(langParam);
  const countryName = countriesJson[country].names[lang];

  return {
    title: `${countryName} — ${year}`,
    openGraph: { title: `${countryName} ${year}` },
    alternates: { canonical: `/${country}/${year}` },
  };
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
    </div>
  );
}
