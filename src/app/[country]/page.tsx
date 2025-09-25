// src/app/[country]/page.tsx

import { redirect, notFound } from "next/navigation";
import type { CountryCode } from "@/types";
import { fetchAvailableCountries, fetchCountryPeriods } from "@/lib/data";
import { DATA_REVALIDATE_SECONDS } from "@/lib/constants";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = DATA_REVALIDATE_SECONDS;

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

  redirect(`/${country}/${periods.sort()[0]}`);
}
