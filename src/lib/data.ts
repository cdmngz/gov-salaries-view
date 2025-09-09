// src/lib/data.ts

import type { CountryCode } from "@/types";
import { serverEnv } from "./env";
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

export async function fetchAvailableCountries() {
  const url = buildFetchPath(["index.json"]);
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`fetchAvailableCountries: failed (${res.status})`);
  const contriesYearsList =
    (await res.json()) as components["schemas"]["CountriesYears"];
  return Object.keys(contriesYearsList) as CountryCode[];
}

export async function fetchCountryPeriods(country: CountryCode) {
  const url = buildFetchPath([country, "index.json"]);
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`fetchCountryPeriods: ${country} (${res.status})`);
  return (await res.json()) as components["schemas"]["CountryYears"];
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
): Promise<{
  data: components["schemas"]["CountryData"];
  rates: components["schemas"]["Rates"];
}> {
  const { dataUrl, ratesUrl } = buildDataUrls(country, year);
  const [dataRes, ratesRes] = await Promise.all([
    fetch(dataUrl),
    fetch(ratesUrl),
  ]);
  if (!dataRes.ok)
    throw new Error(`fetchCountryData: data.json failed (${dataRes.status})`);
  if (!ratesRes.ok)
    throw new Error(`fetchCountryData: rates.json failed (${ratesRes.status})`);
  const [data, rates] = await Promise.all([dataRes.json(), ratesRes.json()]);
  return {
    data: data as components["schemas"]["CountryData"],
    rates: rates as components["schemas"]["Rates"],
  };
}

export async function fetchWorldYears() {
  const url = buildFetchPath(["world", "index.json"]);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetchWorldYears failed (${res.status})`);
  return (await res.json()) as components["schemas"]["WorldYears"];
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

export async function fetchWorldData(year: number): Promise<{
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["Rates"];
}> {
  const { dataUrl, ratesUrl } = buildWorldUrls(year);
  const [dataRes, ratesRes] = await Promise.all([
    fetch(dataUrl),
    fetch(ratesUrl),
  ]);
  if (!dataRes.ok || !ratesRes.ok)
    throw new Error(`fetchWorldYear: data.json failed (${dataRes.status})`);
  const data = (await dataRes.json()) as components["schemas"]["WorldData"];
  const rates = (await ratesRes.json()) as components["schemas"]["Rates"];
  return { data, rates };
}
