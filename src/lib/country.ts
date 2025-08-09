// src/lib/country.ts

import type { Metadata } from "next";
import countriesJson from "@/data/countries.json";
import { TITLE_PREFIX } from "@/i18n";
import { DEFAULT_LANG } from "@/lib/constants";
import type { CountryCode } from "@/types";

export async function generateMetadata(ctx: {
  params: Promise<{ country?: CountryCode; year?: string }>;
}): Promise<Metadata> {
  const { country } = await ctx.params;

  if (!country || !(country in countriesJson)) {
    return { title: "Not found", description: "Country not found" };
  }

  const lang = DEFAULT_LANG;
  const prefix = TITLE_PREFIX[lang];
  const countryName = countriesJson[country].names[lang] ?? country;

  const title = `${prefix} ${countryName}`;
  const description = `Datos públicos para ${countryName}.`;

  return {
    title,
    description,
    openGraph: { title, description },
  };
}
