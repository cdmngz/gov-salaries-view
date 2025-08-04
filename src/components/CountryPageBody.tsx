// src/components/CountryPageBody.tsx

"use client";

import OfficialsList from "@/components/OfficialsList";
import { SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
import type { CountryCode, Data, Rates, Official, SectionKey } from "@/types";
import type { Language } from "@/validators/lang";
import countriesJson from "../data/countries.json";
import { DEFAULT_LANG } from "@/lib/constants";

interface CountryPageBodyProps {
  country: CountryCode;
  lang: Language;
  json: Data;
  baseCurrency: string;
  rates: Rates;
  selectedCurrency: string;
}

const sectionGroups: SectionKey[][] = [
  ["president", "vicePresident", "royalty"],
  ["ministers"],
  ["senate", "congress"],
  ["officials"],
];

export default function CountryPageBody({
  country,
  lang,
  json,
  baseCurrency,
  rates,
  selectedCurrency,
}: CountryPageBodyProps) {
  const { parties } = json;

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        {TITLE_PREFIX[lang] ?? TITLE_PREFIX[DEFAULT_LANG]}{" "}
        {countriesJson[country].names[lang] ??
          countriesJson[country].names[DEFAULT_LANG] ??
          country}
      </h1>

      {sectionGroups.map((group, i) => (
        <div key={i} className="flex flex-wrap justify-center gap-8">
          {group.map((sectionKey) => {
            const list = json[sectionKey] as Official[];
            if (!list || list.length === 0) return null;

            return (
              <OfficialsList
                key={sectionKey}
                title={SECTION_TITLES[sectionKey][lang]}
                officials={list}
                lang={lang}
                baseCurrency={baseCurrency}
                selectedCurrency={selectedCurrency}
                rates={rates}
                parties={parties}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
