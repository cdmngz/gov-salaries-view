// src/lib/data.ts

import type { CountryCode, CountryPeriod, Data, Rates } from "@/types";
import { serverEnv } from "./env";

const API_PREFIX = "/api/data";
const API_BASE_URL = serverEnv.DATA_API_URL?.replace(/\/+$/, "") || "";

function isServer(): boolean {
  return typeof window === "undefined";
}

export function buildFetchPath(parts: string[]): string {
  const base = isServer() ? API_BASE_URL : API_PREFIX;
  return [base, ...parts].join("/");
}

export async function fetchAvailableCountries(): Promise<CountryCode[]> {
  const url = buildFetchPath(["index.json"]);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetchAvailableCountries: failed (${res.status})`);
  }
  const index = (await res.json()) as Record<CountryCode, CountryPeriod[]>;
  return Object.keys(index) as CountryCode[];
}

export async function fetchCountryPeriods(
  country: CountryCode
): Promise<CountryPeriod[]> {
  const url = buildFetchPath([country, "index.json"]);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`fetchCountryPeriods: ${country} (${res.status})`);
  }
  return (await res.json()) as CountryPeriod[];
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

export async function fetchCountryData(
  country: CountryCode,
  year: number
): Promise<{ data: Data; rates: Rates }> {
  const { dataUrl, ratesUrl } = buildDataUrls(country, year);

  const [dataRes, ratesRes] = await Promise.all([
    fetch(dataUrl),
    fetch(ratesUrl),
  ]);

  if (!dataRes.ok) {
    throw new Error(`fetchCountryData: data.json failed (${dataRes.status})`);
  }

  if (!ratesRes.ok) {
    throw new Error(`fetchCountryData: rates.json failed (${ratesRes.status})`);
  }

  const [data, rates] = await Promise.all([dataRes.json(), ratesRes.json()]);

  return {
    data: data as Data,
    rates: rates as Rates,
  };
}
