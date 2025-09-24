// src/app/[country]/[year]/page.tsx

import { Metadata } from "next";

import ClientView from "@/app/[country]/[year]/ClientView";
import DatasetStructuredData from "@/components/DatasetStructuredData";
import ServerHeader from "@/components/ServerHeader";
import { DEFAULT_CURRENCY, DEFAULT_LANG } from "@/lib/constants";
import {
  buildDataUrls,
  fetchAvailableCountries,
  fetchCountryData,
  fetchCountryPeriods,
} from "@/lib/data";
import {
  buildCountrySeo,
  buildSocialImageAlt,
  socialImageUrl,
} from "@/lib/metadata";
import type { CountryCode } from "@/types";
import { parseLang } from "@/validators/lang";
import { SITE_NAME } from "@/lib/seo";

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
  const { lang: langParam, currency: currencyParam } = await searchParams;

  const lang = parseLang(langParam);
  const seoDetails = buildCountrySeo({
    country,
    year,
    lang,
    currency: currencyParam,
  });

  return {
    title: seoDetails.title,
    description: seoDetails.description,
    keywords: seoDetails.keywords,
    openGraph: {
      type: "article",
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
    alternates: {
      canonical: seoDetails.pageUrl,
      languages: seoDetails.languageAlternates,
    },
    robots: {
      index: true,
      follow: true,
    },
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
  const { dataUrl, ratesUrl } = buildDataUrls(country, Number(year));
  const structuredSeo = buildCountrySeo({
    country,
    year,
    lang: DEFAULT_LANG,
    currency: baseCurrency ?? DEFAULT_CURRENCY,
  });

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
      <DatasetStructuredData
        datasetName={structuredSeo.datasetName}
        description={structuredSeo.description}
        url={structuredSeo.pageUrl}
        keywords={structuredSeo.keywords}
        temporalCoverage={String(year)}
        spatialCoverageName={structuredSeo.countryName}
        distributions={[
          {
            name: `${structuredSeo.countryName} ${year} salaries (data.json)`,
            contentUrl: dataUrl,
          },
          {
            name: `${structuredSeo.countryName} ${year} currency rates (rates.json)`,
            contentUrl: ratesUrl,
          },
        ]}
      />
    </div>
  );
}
