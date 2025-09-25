// src/lib/data.ts

import { cache } from "react";

import type { CountryCode } from "@/types";
import { serverEnv } from "./env";
import { components } from "@/types/openapi";
import { DATA_REVALIDATE_SECONDS } from "./constants";

const API_PREFIX = "/api/data";
const API_BASE_URL = serverEnv.DATA_API_URL?.replace(/\/+$/, "") || "";

function isServer(): boolean {
  return typeof window === "undefined";
}

export function buildFetchPath(parts: string[]): string {
  const base = isServer() ? API_BASE_URL : API_PREFIX;
  return [base, ...parts].join("/");
}

async function fetchJson<T>(
  url: string,
  errorContext: string
): Promise<T> {
  const res = await fetch(url, {
    next: { revalidate: DATA_REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`${errorContext} (${res.status})`);
  }
  return (await res.json()) as T;
}

const fetchAvailableCountriesInternal = cache(async () => {
  const url = buildFetchPath(["index.json"]);
  const countriesYearsList = await fetchJson<
    components["schemas"]["CountriesYears"]
  >(url, "fetchAvailableCountries: failed");
  return Object.keys(countriesYearsList) as CountryCode[];
});

export async function fetchAvailableCountries() {
  return fetchAvailableCountriesInternal();
}

const fetchCountryPeriodsInternal = cache(
  async (country: CountryCode) => {
    const url = buildFetchPath([country, "index.json"]);
    return fetchJson<components["schemas"]["CountryYears"]>(
      url,
      `fetchCountryPeriods: ${country}`
    );
  }
);

export async function fetchCountryPeriods(country: CountryCode) {
  return fetchCountryPeriodsInternal(country);
}

export function buildDataUrls(
  country: CountryCode,
  year: number
): { dataUrl: string; ratesUrl: string } {
  const path = [country, `${year}`];
  return {
    dataUrl: buildFetchPath([...path, "data.json"]),
    ratesUrl: buildFetchPath([...path, "rates.json"]),
  };
}

const fetchCountryDataInternal = cache(
  async (
    country: CountryCode,
    year: number
  ): Promise<{
    data: components["schemas"]["CountryData"];
    rates: components["schemas"]["Rates"];
  }> => {
    const { dataUrl, ratesUrl } = buildDataUrls(country, year);
    const [data, rates] = await Promise.all([
      fetchJson<components["schemas"]["CountryData"]>(
        dataUrl,
        "fetchCountryData: data.json failed"
      ),
      fetchJson<components["schemas"]["Rates"]>(
        ratesUrl,
        "fetchCountryData: rates.json failed"
      ),
    ]);
    return { data, rates };
  }
);

export async function fetchCountryData(
  country: CountryCode,
  year: number
): Promise<{
  data: components["schemas"]["CountryData"];
  rates: components["schemas"]["Rates"];
}> {
  return fetchCountryDataInternal(country, year);
}

const fetchWorldYearsInternal = cache(async () => {
  const url = buildFetchPath(["world", "index.json"]);
  return fetchJson<components["schemas"]["WorldYears"]>(
    url,
    "fetchWorldYears failed"
  );
});

export async function fetchWorldYears() {
  return fetchWorldYearsInternal();
}

export function buildWorldUrls(year: number): {
  dataUrl: string;
  ratesUrl: string;
} {
  const path = ["world", `${year}`];
  return {
    dataUrl: buildFetchPath([...path, "data.json"]),
    ratesUrl: buildFetchPath([...path, "rates.json"]),
  };
}

const fetchWorldDataInternal = cache(
  async (
    year: number
  ): Promise<{
    data: components["schemas"]["WorldData"];
    rates: components["schemas"]["Rates"];
  }> => {
    const { dataUrl, ratesUrl } = buildWorldUrls(year);
    const [data, rates] = await Promise.all([
      fetchJson<components["schemas"]["WorldData"]>(
        dataUrl,
        "fetchWorldYear: data.json failed"
      ),
      fetchJson<components["schemas"]["Rates"]>(
        ratesUrl,
        "fetchWorldYear: rates.json failed"
      ),
    ]);
    return { data, rates };
  }
);

export async function fetchWorldData(year: number): Promise<{
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["Rates"];
}> {
  return fetchWorldDataInternal(year);
}
