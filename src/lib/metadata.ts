// src/lib/metadata.ts

import type { Metadata } from "next";

import countriesJson from "@/data/countries.json";
import { DEFAULT_CURRENCY, DEFAULT_LANG } from "@/lib/constants";
import { serverEnv } from "@/lib/env";
import {
  OG_LOCALE_BY_LANG,
  SITE_KEYWORDS,
  SITE_NAME,
  SUPPORTED_LANGUAGES,
} from "@/lib/seo";
import type { CountryCode } from "@/types";
import type { Language } from "@/validators/lang";

const baseUrl = serverEnv.WEB_URL.replace(/\/+$/, "");

function buildPageUrl(path: string): string {
  return `${baseUrl}${path}`;
}

export function buildKeywordList(
  ...extra: Array<string | string[] | null | undefined>
): string[] {
  const keywords = new Set<string>(SITE_KEYWORDS);
  const flatExtras = extra.flatMap((item) => {
    if (!item) return [];
    return Array.isArray(item) ? item : [item];
  });

  flatExtras.forEach((item) => {
    const normalized = item.trim();
    if (normalized) {
      keywords.add(normalized);
    }
  });

  return Array.from(keywords);
}

function buildLanguageAlternates(path: string) {
  return Object.fromEntries(
    SUPPORTED_LANGUAGES.map((lang) => [
      lang,
      `${buildPageUrl(path)}?lang=${lang}`,
    ])
  );
}

function resolveOgLocale(lang: Language) {
  return OG_LOCALE_BY_LANG[lang] ?? OG_LOCALE_BY_LANG[DEFAULT_LANG];
}

function resolveOgAlternateLocales(current: Language) {
  return SUPPORTED_LANGUAGES.filter((lang) => lang !== current).map(
    (lang) => OG_LOCALE_BY_LANG[lang]
  );
}

type CountrySeoParams = {
  country: CountryCode;
  year: string;
  lang: Language;
  currency?: string | null;
};

type BaseSeoDetails = {
  title: string;
  description: string;
  keywords: string[];
  pagePath: string;
  pageUrl: string;
  languageAlternates: Record<string, string>;
  openGraphLocale: string;
  openGraphAlternateLocales: string[];
  datasetName: string;
  currency: string;
};

export type CountrySeoDetails = BaseSeoDetails & {
  countryName: string;
};

export function buildCountrySeo({
  country,
  year,
  lang,
  currency,
}: CountrySeoParams): CountrySeoDetails {
  const safeCurrency = (currency ?? DEFAULT_CURRENCY).toUpperCase();
  const fallbackNames = countriesJson[country]?.names ?? countriesJson["world"].names;
  const countryName =
    countriesJson[country]?.names?.[lang] ??
    fallbackNames?.[lang] ??
    fallbackNames?.[DEFAULT_LANG] ??
    country.toUpperCase();

  const pagePath = `/${country}/${year}`;
  const pageUrl = buildPageUrl(pagePath);

  const title = `${countryName} Government Salaries (${year})`;
  const description = `Explore ${countryName}'s ${year} public sector salary data with ${safeCurrency} conversions, role comparisons, and transparent pay insights.`;

  const keywords = buildKeywordList([
    `${countryName} salaries`,
    `${countryName} public sector pay`,
    `${countryName} government compensation`,
    `${countryName} civil service salaries`,
    `${countryName} salary database`,
    `${countryName} ${year} salaries`,
    `${year} government salaries`,
    `${countryName} salaries ${safeCurrency}`,
  ]);

  return {
    countryName,
    title,
    description,
    keywords,
    pagePath,
    pageUrl,
    languageAlternates: buildLanguageAlternates(pagePath),
    openGraphLocale: resolveOgLocale(lang),
    openGraphAlternateLocales: resolveOgAlternateLocales(lang),
    datasetName: `${countryName} Government Salaries ${year}`,
    currency: safeCurrency,
  };
}

type WorldSeoParams = {
  year: string;
  lang: Language;
  currency?: string | null;
};

type WorldSeoDetails = BaseSeoDetails & {
  worldName: string;
};

export function buildWorldSeo({
  year,
  lang,
  currency,
}: WorldSeoParams): WorldSeoDetails {
  const safeCurrency = (currency ?? DEFAULT_CURRENCY).toUpperCase();
  const worldNames = countriesJson["world"].names;
  const worldName = worldNames[lang] ?? worldNames[DEFAULT_LANG];

  const pagePath = `/world/${year}`;
  const pageUrl = buildPageUrl(pagePath);

  const title = `${worldName} Government Salaries (${year})`;
  const description = `Analyze global government salary data for ${year} with ${safeCurrency} conversions, aggregated comparisons, and transparent insights across countries.`;

  const keywords = buildKeywordList([
    `${worldName} salaries`,
    "global government salaries",
    "international public sector pay",
    "worldwide salary transparency",
    `${year} global salaries`,
    `${year} global salaries ${safeCurrency}`,
  ]);

  return {
    worldName,
    title,
    description,
    keywords,
    pagePath,
    pageUrl,
    languageAlternates: buildLanguageAlternates(pagePath),
    openGraphLocale: resolveOgLocale(lang),
    openGraphAlternateLocales: resolveOgAlternateLocales(lang),
    datasetName: `${worldName} Government Salaries ${year}`,
    currency: safeCurrency,
  };
}

export function buildSocialImageAlt(subject: string) {
  return `${subject} salary data visualization`;
}

export const socialImageUrl = buildPageUrl("/globe.svg");
export const catalogPublisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: baseUrl,
};

type StaticSeoParams = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
};

type StaticSeoDetails = {
  title: string;
  description: string;
  keywords: string[];
  pagePath: string;
  pageUrl: string;
  languageAlternates: Record<string, string>;
  openGraphLocale: string;
  openGraphAlternateLocales: string[];
};

export function buildStaticSeo({
  path,
  title,
  description,
  keywords,
}: StaticSeoParams): StaticSeoDetails {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pageUrl = buildPageUrl(normalizedPath);

  return {
    title,
    description,
    keywords: buildKeywordList(keywords),
    pagePath: normalizedPath,
    pageUrl,
    languageAlternates: buildLanguageAlternates(normalizedPath),
    openGraphLocale: resolveOgLocale(DEFAULT_LANG),
    openGraphAlternateLocales: resolveOgAlternateLocales(DEFAULT_LANG),
  };
}

export function buildStaticMetadata(params: StaticSeoParams): Metadata {
  const seo = buildStaticSeo(params);
  const imageAlt = buildSocialImageAlt(seo.title);

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: {
      canonical: seo.pageUrl,
      languages: seo.languageAlternates,
    },
    openGraph: {
      type: "article",
      title: seo.title,
      description: seo.description,
      url: seo.pageUrl,
      siteName: SITE_NAME,
      locale: seo.openGraphLocale,
      alternateLocale: seo.openGraphAlternateLocales,
      images: [{ url: socialImageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [socialImageUrl],
    },
    robots: { index: true, follow: true },
  };
}
