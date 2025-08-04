// src/lib/country.ts

import { DESCRIPTION_TEMPLATE, TITLE_PREFIX } from "@/i18n";
import type { CountryCode, CountryPeriod, Data, Rates } from "@/types";
import type { Metadata } from "next";
import {
  fetchAvailableCountries,
  fetchCountryPeriods,
  fetchCountryData,
} from "./data";
import countriesJson from "../data/countries.json";
import { headers, cookies } from "next/headers";
import { Language } from "@/validators/lang";
import { DEFAULT_COUNTRY, DEFAULT_LANG } from "./constants";

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();
  return countries.map((code) => ({ country: code }));
}

export type LoadCountryDataResult = {
  country: CountryCode;
  lang: Language;
  json: Data;
  baseCurrency: string;
  rates: Rates;
  selectedCurrency: string;
};

export async function loadCountryData(ctx: {
  params: { country?: string };
  searchParams: {
    lang?: Language;
    year?: string;
    semester?: string;
    currency?: string;
  };
  headers?: ReturnType<typeof headers>;
  cookies?: ReturnType<typeof cookies>;
}): Promise<LoadCountryDataResult> {
  const { params, searchParams } = ctx;

  const rawCountry = params.country;
  const lang = searchParams.lang ?? DEFAULT_LANG;
  const qYear = searchParams.year;
  const qSemester = searchParams.semester;
  const qCurrency = searchParams.currency;

  const headersList = headers();
  const cookiesList = cookies();

  const country: CountryCode =
    (rawCountry?.toLowerCase().trim() as CountryCode) ||
    ((await headersList)
      .get("cloudfront-viewer-country")
      ?.toLowerCase() as CountryCode) ||
    ((await cookiesList)
      .get("redirected-country")
      ?.value.toLowerCase() as CountryCode) ||
    DEFAULT_COUNTRY;

  const periods = await fetchCountryPeriods(country);
  if (periods.length === 0) throw new Error("NO_PERIODS_FOUND");

  const { year, semester }: CountryPeriod =
    qYear && qSemester
      ? { year: Number(qYear), semester: Number(qSemester) as 1 | 2 }
      : periods[periods.length - 1];

  const { data: json, rates } = await fetchCountryData(country, year, semester);

  const baseCurrency = json.baseCurrency;
  const selectedCurrency =
    qCurrency && rates.rates[qCurrency] ? qCurrency : baseCurrency;

  return {
    country,
    lang,
    json,
    baseCurrency,
    rates,
    selectedCurrency,
  };
}

export async function generateMetadata(ctx: {
  params: Promise<{ country?: string }>;
  searchParams: Promise<{
    lang?: Language;
    year?: string;
    semester?: string;
    currency?: string;
  }>;
}): Promise<Metadata> {
  const { country } = await ctx.params;
  const { lang } = await ctx.searchParams;

  const hdrs = headers();
  const cks = cookies();

  const data = await loadCountryData({
    params: { country },
    searchParams: { lang },
    headers: hdrs,
    cookies: cks,
  });

  const prefix = TITLE_PREFIX[data.lang] ?? TITLE_PREFIX.en;
  const countryName =
    countriesJson[data.country].names[data.lang] ??
    countriesJson[data.country].names.en ??
    data.country;
  const title = `${prefix} ${countryName}`;
  const description =
    DESCRIPTION_TEMPLATE[data.lang] ?? DESCRIPTION_TEMPLATE.en;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export type PageProps = Parameters<typeof loadCountryData>[0];
