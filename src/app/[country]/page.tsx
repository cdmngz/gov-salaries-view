// src/app/[country]/page.tsx

import { notFound, redirect } from "next/navigation";

import { fetchAvailableCountries, fetchCountryPeriods } from "@/lib/data";
import type { CountryCode } from "@/types";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

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

  const first = [...periods].sort((a, b) => a - b)[0];
  redirect(`/${country}/${first}`);
}
