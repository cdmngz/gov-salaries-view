// src/app/world/[year]/page.tsx

import { Metadata } from "next";

import ClientView from "@/app/world/[year]/ClientView";
import DatasetStructuredData from "@/components/DatasetStructuredData";
import ServerHeader from "@/components/ServerHeader";
import countriesJson from "@/data/countries.json";
import { DEFAULT_CURRENCY, DEFAULT_LANG } from "@/lib/constants";
import { buildWorldUrls, fetchWorldData, fetchWorldYears } from "@/lib/data";
import {
  buildSocialImageAlt,
  buildWorldSeo,
  socialImageUrl,
} from "@/lib/metadata";
import { SITE_NAME } from "@/lib/seo";
import { parseLang } from "@/validators/lang";
import dynamic from "next/dynamic";
import type { components } from "@/types/openapi";

type WorldPoliticalMapProps = {
  data: components["schemas"]["WorldData"];
  year: number;
};

type RangeValue = 1 | 2 | 3 | 4 | 5;

const EXECUTIVE_WING_COLORS: Record<RangeValue, { label: string; fill: string }> = {
  5: { label: "Derecha", fill: "#b91c1c" },
  4: { label: "Centro-derecha", fill: "#f97316" },
  3: { label: "Centro", fill: "#facc15" },
  2: { label: "Centro-izquierda", fill: "#38bdf8" },
  1: { label: "Izquierda", fill: "#2563eb" },
};

const WORLD_GEOGRAPHIES_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countriesRecord = countriesJson as Record<
  string,
  (typeof countriesJson)[keyof typeof countriesJson]
>;

const WorldPoliticalMap = dynamic<WorldPoliticalMapProps>(
  () =>
    import("react-simple-maps").then(({ ComposableMap, Geographies, Geography }) => {
      const MapComponent = ({ data, year }: WorldPoliticalMapProps) => {
        const legendEntries: Array<{
          key: string;
          label: string;
          fill: string;
          isFallback?: boolean;
        }> = [
          {
            key: "right",
            label: EXECUTIVE_WING_COLORS[5].label,
            fill: EXECUTIVE_WING_COLORS[5].fill,
          },
          {
            key: "center-right",
            label: EXECUTIVE_WING_COLORS[4].label,
            fill: EXECUTIVE_WING_COLORS[4].fill,
          },
          {
            key: "center",
            label: EXECUTIVE_WING_COLORS[3].label,
            fill: EXECUTIVE_WING_COLORS[3].fill,
          },
          {
            key: "center-left",
            label: EXECUTIVE_WING_COLORS[2].label,
            fill: EXECUTIVE_WING_COLORS[2].fill,
          },
          {
            key: "left",
            label: EXECUTIVE_WING_COLORS[1].label,
            fill: EXECUTIVE_WING_COLORS[1].fill,
          },
          {
            key: "no-data",
            label: "Sin datos",
            fill: "#ffffff",
            isFallback: true,
          },
        ];

        return (
          <section className="space-y-4">
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold">Mapa político mundial {year}</h2>
              <p className="text-sm text-muted-foreground">
                Orientación del poder ejecutivo por país en {year}.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-xl border bg-card shadow-sm">
              <ComposableMap
                projectionConfig={{ scale: 145 }}
                className="w-full h-auto"
                data-testid="world-political-map"
              >
                <Geographies geography={WORLD_GEOGRAPHIES_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const isoCode =
                        typeof geo.properties.ISO_A2 === "string"
                          ? geo.properties.ISO_A2.toUpperCase()
                          : "";
                      if (!isoCode || isoCode === "-99") {
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#ffffff"
                            stroke="#d1d5db"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { outline: "none", fill: "#e5e7eb" },
                              pressed: { outline: "none" },
                            }}
                          />
                        );
                      }

                      const isoLookup = isoCode.toLowerCase();
                      const stats = data?.[isoLookup];
                      const rawRange = Array.isArray(
                        stats?.partyRangeStatsSplit?.executive?.mostPopularRanges
                      )
                        ? stats?.partyRangeStatsSplit?.executive?.mostPopularRanges?.find(
                            (value) =>
                              typeof value === "number" && value >= 1 && value <= 5
                          )
                        : undefined;
                      const rangeValue = rawRange as RangeValue | undefined;
                      const orientation = rangeValue
                        ? EXECUTIVE_WING_COLORS[rangeValue]
                        : undefined;
                      const countryRecord = countriesRecord[isoLookup];
                      const countryName =
                        countryRecord?.names?.en ??
                        (typeof geo.properties.NAME === "string"
                          ? geo.properties.NAME
                          : isoCode);
                      const tooltipLabel = orientation?.label ?? "Sin datos";

                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={orientation?.fill ?? "#ffffff"}
                          stroke="#d1d5db"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: "none" },
                            hover: {
                              outline: "none",
                              fill: orientation?.fill ?? "#e5e7eb",
                            },
                            pressed: { outline: "none" },
                          }}
                          title={`${countryName} (${isoCode}) — ${tooltipLabel}`}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {legendEntries.map((entry) => (
                <div key={entry.key} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full border border-muted-foreground/40"
                    style={{
                      backgroundColor: entry.isFallback ? "#ffffff" : entry.fill,
                    }}
                  />
                  <span className={entry.isFallback ? "text-muted-foreground" : undefined}>
                    {entry.label}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      };

      return MapComponent;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-6 w-56 rounded bg-muted animate-pulse" />
          <div className="mx-auto h-4 w-72 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-80 w-full rounded-xl border bg-muted animate-pulse" />
      </div>
    ),
  }
);

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
        <div className="space-y-8">
          <WorldPoliticalMap data={data} year={safeYear} />
          <ClientView data={data} rates={rates} />
        </div>
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
