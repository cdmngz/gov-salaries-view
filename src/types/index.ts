//src/types/index.ts

import { Language } from "@/validators/lang";
import type countriesJson from "../data/countries.json";

export type CountriesData = typeof countriesJson;
export type CountryCode = keyof CountriesData;

export interface CountryPeriod {
  year: number;
  semester: 1 | 2;
}

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

export type SectionData = {
  [K in SectionKey]: Official[];
};

export interface Rates {
  baseCurrency: string;
  timestamp: string;
  rates: Record<string, number>;
}

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
  detail?: {
    [key: string]: number;
  };
}

export type Translation = Record<Language, string>;
