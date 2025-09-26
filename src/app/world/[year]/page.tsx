// src/app/world/[year]/page.tsx

import { Metadata } from "next";

import ClientView from "@/app/world/[year]/ClientView";
import DatasetStructuredData from "@/components/DatasetStructuredData";
import ServerHeader from "@/components/ServerHeader";
import { DEFAULT_CURRENCY, DEFAULT_LANG } from "@/lib/constants";
import { buildWorldUrls, fetchWorldData, fetchWorldYears } from "@/lib/data";
import {
  buildSocialImageAlt,
  buildWorldSeo,
  socialImageUrl,
} from "@/lib/metadata";
import { SITE_NAME } from "@/lib/seo";
import { parseLang } from "@/validators/lang";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = false;

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
  const seoDetails = buildWorldSeo({ year, lang, currency: currencyParam });

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
        { url: socialImageUrl, alt: buildSocialImageAlt(seoDetails.worldName) },
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
    robots: { index: true, follow: true },
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
  const { dataUrl, ratesUrl } = buildWorldUrls(safeYear);
  const structuredSeo = buildWorldSeo({
    year: String(safeYear),
    lang: DEFAULT_LANG,
    currency: DEFAULT_CURRENCY,
  });

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
      <DatasetStructuredData
        datasetName={structuredSeo.datasetName}
        description={structuredSeo.description}
        url={structuredSeo.pageUrl}
        keywords={structuredSeo.keywords}
        temporalCoverage={String(safeYear)}
        spatialCoverageName={structuredSeo.worldName}
        distributions={[
          {
            name: `${structuredSeo.worldName} ${safeYear} salaries (data.json)`,
            contentUrl: dataUrl,
          },
          {
            name: `${structuredSeo.worldName} ${safeYear} currency rates (rates.json)`,
            contentUrl: ratesUrl,
          },
        ]}
      />
    </div>
  );
}
