//src/types/index.ts

import { Language } from "@/validators/lang";
import type countriesJson from "../data/countries.json";

export type CountriesData = typeof countriesJson;
export type CountryCode = keyof CountriesData;

export const sectionToBranchMap = {
  royalty: "Royalty",
  president: "Executive",
  vicePresident: "Executive",
  ministers: "Ministers",
  congress: "Congress",
  senate: "Senate",
  officials: "Officials",
} as const;

export type SectionKey = keyof typeof sectionToBranchMap;
export type Branch = (typeof sectionToBranchMap)[SectionKey];
export const sections = Object.keys(sectionToBranchMap) as SectionKey[];
export type DataSection = SectionKey;

export type Translation = Record<Language, string>;
