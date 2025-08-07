// src/components/RenderCountryPage.server.tsx

import CountryPageBody from "@/components/CountryPageBody";
import NotFound from "@/app/not-found";
import countriesJson from "@/data/countries.json";
import { loadCountryData } from "@/lib/country";
import { buildFetchPath } from "@/lib/data";
import { Language } from "@/validators/lang";
import { notFound } from "next/navigation";
import { CountryCode } from "@/types";

interface RouteProps {
  params: Promise<{ country: string; year: string }>;
  searchParams: Promise<{
    lang?: Language;
    currency?: string;
  }>;
}

export default async function RenderCountryPage(props: RouteProps) {
  const { country, year } = await props.params;
  const { lang, currency } = await props.searchParams;

  const yearNumber = Number(year);

  if (!(country in countriesJson)) {
    return (
      <NotFound
        lang={lang ?? "en"}
        suggestedYear={2025}
        availableCountries={Object.keys(countriesJson) as CountryCode[]}
      />
    );
  }

  const validYears = await fetchAvailableYearsViaProxy(country);

  if (!validYears.includes(yearNumber)) {
    return (
      <NotFound
        lang={lang ?? "en"}
        suggestedCountry={country}
        availableYears={validYears}
      />
    );
  }

  try {
    const data = await loadCountryData({
      params: { country, year },
      searchParams: { lang, currency },
    });

    return <CountryPageBody {...data} />;
  } catch {
    return notFound();
  }
}

async function fetchAvailableYearsViaProxy(country: string): Promise<number[]> {
  const url = buildFetchPath([country, "index.json"]);
  const res = await fetch(url, { cache: "force-cache" });

  if (!res.ok) return [];

  try {
    const periods = (await res.json()) as { year: number }[];
    const years = periods.map((p) => p.year);
    return Array.from(new Set(years)).sort((a, b) => b - a); // unique & sorted
  } catch (e) {
    console.error("❌ Error parsing available years:", e);
    return [];
  }
}
