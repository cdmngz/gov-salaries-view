// src/lib/data.ts
import { z } from "zod";
import type { CountryCode, CountryPeriod, Data, Rates } from "@/types";

const API_PREFIX = "/api/data";
let DATA_API_URL = "";

if (typeof window === "undefined") {
  const EnvSchema = z.object({
    DATA_API_URL: z.url(),
  });
  const { DATA_API_URL: raw } = EnvSchema.parse(process.env);
  DATA_API_URL = raw.replace(/\/+$/, "");
}

/** Build the URL or path to fetch: proxies on client, calls real API on server */
function buildFetchPath(parts: string[]): string {
  if (typeof window !== "undefined") {
    // client: hit our Next.js API route
    return [API_PREFIX, ...parts].join("/");
  }
  // server: hit the real upstream
  return [DATA_API_URL, ...parts].join("/");
}

export async function fetchAvailableCountries(): Promise<CountryCode[]> {
  const url = buildFetchPath(["index.json"]);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch country list from ${url}`);
  }
  const index = (await res.json()) as Record<CountryCode, CountryPeriod>;
  return Object.keys(index) as CountryCode[];
}

export async function fetchCountryPeriods(
  country: CountryCode
): Promise<CountryPeriod[]> {
  const url = buildFetchPath([country, "index.json"]);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch periods for ${country} from ${url}`);
  }
  return (await res.json()) as CountryPeriod[];
}

export function buildDataUrl(
  country: CountryCode,
  year: number,
  semester: number
): { data: string; rates: string } {
  const dataPath = buildFetchPath([
    country,
    `${year}`,
    `${semester}`,
    "data.json",
  ]);
  const ratesPath = buildFetchPath([
    country,
    `${year}`,
    `${semester}`,
    "rates.json",
  ]);
  return { data: dataPath, rates: ratesPath };
}

export async function fetchCountryData(
  country: CountryCode,
  year: number,
  semester: number
): Promise<{ data: Data; rates: Rates }> {
  const { data: dataUrl, rates: ratesUrl } = buildDataUrl(
    country,
    year,
    semester
  );

  const [dataRes, ratesRes] = await Promise.all([
    fetch(dataUrl),
    fetch(ratesUrl),
  ]);

  if (!dataRes.ok) {
    throw new Error(
      `Failed to load data.json from ${dataUrl} (status ${dataRes.status})`
    );
  }
  if (!ratesRes.ok) {
    throw new Error(
      `Failed to load rates.json from ${ratesUrl} (status ${ratesRes.status})`
    );
  }

  const [data, rates] = await Promise.all([dataRes.json(), ratesRes.json()]);
  return { data: data as Data, rates: rates as Rates };
}
