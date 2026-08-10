//src/types/index.ts

import { Language } from "@/validators/lang";
import type countriesJson from "../data/countries.json";

type CountriesData = typeof countriesJson;
export type CountryCode = keyof CountriesData;

export type SectionKey =
  | "royalty"
  | "executive"
  | "ministers"
  | "deputies"
  | "senate"
  | "officials";

export type Translation = Record<Language, string>;
