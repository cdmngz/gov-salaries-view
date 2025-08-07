import { DESCRIPTION_TEMPLATE, TITLE_PREFIX } from "@/i18n";
import type { CountryCode, Data, Rates } from "@/types";
import { Language } from "@/validators/lang";
import type { Metadata } from "next";
import countriesJson from "../data/countries.json";
import { DEFAULT_COUNTRY, DEFAULT_LANG } from "./constants";
import {
  fetchAvailableCountries,
  fetchCountryData,
  fetchCountryPeriods,
} from "./data";

export async function generateStaticParams() {
  const countries = await fetchAvailableCountries();

  const allParams = await Promise.all(
    countries.map(async (country) => {
      const periods = await fetchCountryPeriods(country);
      const years = Array.from(new Set(periods.map((p) => p.year)));
      return years.map((year) => ({ country, year: year.toString() }));
    })
  );

  return allParams.flat();
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
  params: { country?: string; year?: string };
  searchParams: {
    lang?: Language;
    currency?: string;
  };
}): Promise<LoadCountryDataResult> {
  const { params, searchParams } = ctx;

  const rawCountry = params.country;
  const rawYear = params.year;
  const lang = searchParams.lang ?? DEFAULT_LANG;
  const qCurrency = searchParams.currency;

  const country: CountryCode =
    (rawCountry?.toLowerCase().trim() as CountryCode) || DEFAULT_COUNTRY;

  const periods = await fetchCountryPeriods(country);
  if (periods.length === 0) throw new Error("NO_PERIODS_FOUND");

  const validYears = Array.from(new Set(periods.map((p) => p.year)));
  const year = rawYear ? Number(rawYear) : validYears.at(-1);

  if (!validYears.includes(Number(year))) throw new Error("INVALID_YEAR");

  const { data: json, rates } = await fetchCountryData(country, Number(year));

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
  params: Promise<{ country?: string; year?: string }>;
  searchParams: Promise<{
    lang?: Language;
    currency?: string;
  }>;
}): Promise<Metadata> {
  const { country, year } = await ctx.params;
  const { lang } = await ctx.searchParams;

  if (!country || !(country in countriesJson)) {
    return {
      title: "Not found",
      description: "Country not found",
    };
  }

  try {
    const data = await loadCountryData({
      params: { country, year },
      searchParams: { lang },
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
  } catch {
    return {
      title: "Unavailable",
      description: "Data not available for this year.",
    };
  }
}

export type PageProps = Parameters<typeof loadCountryData>[0];
