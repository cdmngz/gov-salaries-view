// src/app/world/[year]/page.tsx

import ServerHeader from "@/components/ServerHeader";
import countriesJson from "@/data/countries.json";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { fetchWorldData, fetchWorldYears } from "@/lib/data";
import { parseLang } from "@/validators/lang";
import { Metadata } from "next";
import ClientView from "./ClientView";

export async function generateStaticParams() {
  const years = await fetchWorldYears();
  return years.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ lang?: string; currency?: string }>;
}): Promise<Metadata> {
  const { year } = await params;
  const { lang: langParam, currency: currencyParam } = await searchParams;

  const lang = parseLang(langParam);
  const currency = (currencyParam ?? DEFAULT_CURRENCY).toUpperCase();
  const countryName = countriesJson["world"].names[lang];

  return {
    title: `${countryName} — ${year} • ${currency}`,
    openGraph: { title: `${countryName} ${year} — ${currency}` },
    alternates: { canonical: `/world/${year}` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const yearNum = Number(year);

  const years = await fetchWorldYears();
  const safeYear = years.includes(yearNum) ? yearNum : Math.max(...years);

  const { data, rates } = await fetchWorldData(safeYear);

  return (
    <div className="min-h-screen flex flex-col">
      <ServerHeader
        country="world"
        year={safeYear}
        currency={DEFAULT_CURRENCY}
        baseCurrency={DEFAULT_CURRENCY}
        rates={rates}
        periods={years}
      />
      <main className="flex-1 p-6">
        <ClientView data={data} rates={rates} />
      </main>
    </div>
  );
}
