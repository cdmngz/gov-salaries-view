// src/lib/seo.ts

export const SITE_NAME = "OfficialSalaries" as const;
export const SITE_DESCRIPTION =
  "OfficialSalaries.org is an open database of public sector compensation. " +
  "Explore verified salary information for government officials across the globe.";

export const SITE_KEYWORDS = [
  "government salaries",
  "public data",
  "official salaries",
  "salary transparency",
  "open government",
] as const;

export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "pt", "de"] as const;

export const OG_LOCALE_BY_LANG = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  pt: "pt_PT",
  de: "de_DE",
} as const;

export const DEFAULT_ROBOTS = {
  index: true,
  follow: true,
  maxImagePreview: "large",
  maxSnippet: -1,
  maxVideoPreview: -1,
  googleBot: {
    index: true,
    follow: true,
    maxImagePreview: "large",
    maxSnippet: -1,
    maxVideoPreview: -1,
  },
} as const;
