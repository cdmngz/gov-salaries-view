// src/lib/data.ts

import { cache } from "react";

import { serverEnv } from "@/lib/env";
import type { CountryCode } from "@/types";
import { components } from "@/types/openapi";

const API_PREFIX = "/api/data";
const API_BASE_URL = serverEnv.DATA_API_URL?.replace(/\/+$/, "") || "";

function isServer(): boolean {
  return typeof window === "undefined";
}

export function buildFetchPath(parts: string[]): string {
  const base = isServer() ? API_BASE_URL : API_PREFIX;
  return [base, ...parts].join("/");
}

async function fetchJson<T>(url: string, errorContext: string): Promise<T> {
  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) throw new Error(`${errorContext} (${res.status})`);
  return (await res.json()) as T;
}

function normalizeYears(input: unknown): number[] {
  if (Array.isArray(input)) {
    return input.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  }
  if (input && typeof input === "object") {
    return Object.keys(input as Record<string, unknown>)
      .map((k) => Number(k))
      .filter((v) => Number.isFinite(v));
  }
  return [];
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

const fetchCountryPeriodsInternal = cache(async (country: CountryCode) => {
  const url = buildFetchPath([country, "index.json"]);
  const raw = await fetchJson<components["schemas"]["CountryYears"]>(
    url,
    `fetchCountryPeriods: ${country}`
  );
  return normalizeYears(raw);
});

export async function fetchCountryPeriods(country: CountryCode) {
  return fetchCountryPeriodsInternal(country);
}

export function buildDataUrls(
  country: CountryCode,
  year: number
): { dataUrl: string; economicsUrl: string; ratesUrl: string } {
  const path = [country, `${year}`];
  const worldUrls = buildWorldUrls(year);
  return {
    dataUrl: buildFetchPath([...path, "data.json"]),
    economicsUrl: buildFetchPath([...path, "economics.json"]),
    ratesUrl: worldUrls.ratesUrl,
  };
}

const fetchCountryDataInternal = cache(
  async (
    country: CountryCode,
    year: number
  ): Promise<{
    data: components["schemas"]["CountryData"];
    economics: components["schemas"]["CountryEconomics"];
    rates: components["schemas"]["Rates"];
  }> => {
    const { dataUrl, economicsUrl, ratesUrl } = buildDataUrls(country, year);
    const [data, economics, rates] = await Promise.all([
      fetchJson<components["schemas"]["CountryData"]>(
        dataUrl,
        "fetchCountryData: data.json failed"
      ),
      fetchJson<components["schemas"]["CountryEconomics"]>(
        economicsUrl,
        "fetchCountryData: economics.json failed"
      ),
      fetchWorldRatesInternal(year),
    ]);
    return { data, economics, rates };
  }
);

export async function fetchCountryData(
  country: CountryCode,
  year: number
): Promise<{
  data: components["schemas"]["CountryData"];
  economics: components["schemas"]["CountryEconomics"];
  rates: components["schemas"]["Rates"];
}> {
  return fetchCountryDataInternal(country, year);
}

const fetchWorldYearsInternal = cache(async () => {
  const url = buildFetchPath(["world", "index.json"]);
  const raw = await fetchJson<components["schemas"]["WorldYears"]>(
    url,
    "fetchWorldYears failed"
  );
  return normalizeYears(raw);
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

const fetchWorldRatesInternal = cache(
  async (year: number): Promise<components["schemas"]["Rates"]> => {
    const { ratesUrl } = buildWorldUrls(year);
    return fetchJson<components["schemas"]["Rates"]>(
      ratesUrl,
      "fetchWorldRates: rates.json failed"
    );
  }
);

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
      fetchWorldRatesInternal(year),
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

export async function fetchWorldRates(
  year: number
): Promise<components["schemas"]["Rates"]> {
  return fetchWorldRatesInternal(year);
}
