//src/types/index.ts

import { Language } from "@/validators/lang";
import type countriesJson from "../data/countries.json";

export type CountriesData = typeof countriesJson;
export type CountryCode = keyof CountriesData;

export type CountryYear = number;

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

export interface Rates {
  baseCurrency: string;
  GDP?: number;
  rates: Record<string, number>;
  timestamp: string;
}

export type SectionData = {
  [K in SectionKey]: Official[];
};

export type Data = {
  baseCurrency: string;
  parties: Record<string, PartyMeta>;
} & SectionData;

export type GovernmentData = {
  baseCurrency: string;
  rates: Rates;
  parties: Record<string, PartyMeta>;
} & SectionData;

export interface Official {
  name: string;
  gender: "M" | "F" | "X";
  role: string;
  salary: Salary;
  district?: string;
  party?: string;
  budget?: number;
  details?: Record<string, string>;
}

export interface PartyMeta {
  name: string;
  en?: string;
  range: number;
  color: string;
}

export interface Salary {
  gross: number;
  net: number;
}

export type Translation = Record<Language, string>;

export type WorldCountryEntry = {
  GDP: number;
  ministers: { quantity: number; budget: number };
  congress: { quantity: number };
  senate: { quantity: number };
};

export type WorldYearData = Record<CountryCode, WorldCountryEntry>;
