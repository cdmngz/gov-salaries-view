// src/app/[country]/page.tsx

import { redirect, notFound } from "next/navigation";
import type { CountryCode } from "@/types";
import { fetchAvailableCountries, fetchCountryPeriods } from "@/lib/data";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();
  return countries.map((country) => ({ country }));
}

export default async function CountryIndex({
  params,
}: {
  params: Promise<{ country: CountryCode }>;
}) {
  const { country } = await params;

  const valid = await fetchAvailableCountries();
  if (!valid.includes(country)) {
    notFound();
  }

  const periods = await fetchCountryPeriods(country);
  if (!periods?.length) {
    notFound();
  }

  const latest = periods.map((p) => p.year).sort((a, b) => b - a)[0];
  redirect(`/${country}/${latest}`);
}
