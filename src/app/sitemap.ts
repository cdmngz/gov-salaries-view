// src/app/sitemap.ts

import type { MetadataRoute } from "next";

import { fetchCountriesPeriodsMap, fetchWorldYears } from "@/lib/data";
import { serverEnv } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = serverEnv.WEB_URL.replace(/\/+$/, "");
  const now = new Date();

  const toUrl = (path: string) => (path ? `${baseUrl}/${path}` : baseUrl);

  const staticRoutes: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "docs", priority: 0.5, changeFrequency: "yearly" },
    { path: "docs/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "docs/terms-of-use", priority: 0.4, changeFrequency: "yearly" },
    { path: "docs/data-sources", priority: 0.4, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: toUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  try {
    const countriesPeriods = await fetchCountriesPeriodsMap();
    for (const [country, periods] of Object.entries(countriesPeriods)) {
      entries.push({
        url: toUrl(country),
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
      });

      for (const year of periods) {
        entries.push({
          url: toUrl(`${country}/${year}`),
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.warn("sitemap: failed to load country list", error);
  }

  try {
    const worldYears = await fetchWorldYears();
    for (const year of worldYears) {
      entries.push({
        url: toUrl(`world/${year}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.warn("sitemap: failed to load world years", error);
  }

  return entries;
}
