// src/app/[country]/page.tsx

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DEFAULT_LANG } from "@/lib/constants";
import { fetchAvailableCountries, fetchCountryPeriods } from "@/lib/data";
import { buildCountrySeo, buildSocialImageAlt, socialImageUrl } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/seo";
import type { CountryCode } from "@/types";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();
  return countries.map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: CountryCode }>;
}): Promise<Metadata> {
  const { country } = await params;
  const valid = await fetchAvailableCountries();

  if (!valid.includes(country)) {
    return {};
  }

  const periods = await fetchCountryPeriods(country);
  if (!periods?.length) {
    return {};
  }

  const first = [...periods].sort((a, b) => a - b)[0];
  const seoDetails = buildCountrySeo({
    country,
    year: String(first),
    lang: DEFAULT_LANG,
  });

  return {
    title: seoDetails.title,
    description: seoDetails.description,
    keywords: seoDetails.keywords,
    alternates: {
      canonical: seoDetails.pageUrl,
      languages: seoDetails.languageAlternates,
    },
    openGraph: {
      type: "website",
      title: seoDetails.title,
      description: seoDetails.description,
      url: seoDetails.pageUrl,
      siteName: SITE_NAME,
      locale: seoDetails.openGraphLocale,
      alternateLocale: seoDetails.openGraphAlternateLocales,
      images: [
        {
          url: socialImageUrl,
          alt: buildSocialImageAlt(seoDetails.countryName),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoDetails.title,
      description: seoDetails.description,
      images: [socialImageUrl],
    },
    robots: { index: true, follow: true },
  };
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
