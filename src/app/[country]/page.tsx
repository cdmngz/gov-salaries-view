// src/app/[country]/page.tsx

import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { DEFAULT_LANG } from "@/lib/constants";
import { fetchCountriesPeriodsMap } from "@/lib/data";
import { buildCountrySeo, buildSocialImageAlt, socialImageUrl } from "@/lib/metadata";
import { DEFAULT_ROBOTS, SITE_NAME } from "@/lib/seo";
import type { CountryCode } from "@/types";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

export async function generateStaticParams() {
  const countriesPeriods = await fetchCountriesPeriodsMap();
  return Object.keys(countriesPeriods).map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: CountryCode }>;
}): Promise<Metadata> {
  const { country } = await params;
  const countriesPeriods = await fetchCountriesPeriodsMap();
  const periods = countriesPeriods[country];
  if (!periods?.length) {
    return {};
  }

  const latest = Math.max(...periods);
  const seoDetails = buildCountrySeo({
    country,
    year: String(latest),
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
    robots: DEFAULT_ROBOTS,
  };
}

export default async function CountryIndex({
  params,
}: {
  params: Promise<{ country: CountryCode }>;
}) {
  const { country } = await params;

  const countriesPeriods = await fetchCountriesPeriodsMap();
  const periods = countriesPeriods[country];
  if (!periods?.length) {
    notFound();
  }

  const latest = Math.max(...periods);
  redirect(`/${country}/${latest}`);
}
