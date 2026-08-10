// src/app/[country]/[year]/ClientView.tsx

"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import OfficialsList from "@/components/OfficialsList";
import countriesJson from "@/data/countries.json";
import { SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import type { CountryCode, SectionKey } from "@/types";
import { components } from "@/types/openapi";
import { parseLang, type Language } from "@/validators/lang";

const sectionGroups: SectionKey[][] = [
  ["executive", "royalty"],
  ["ministers"],
  ["senate", "deputies"],
  ["officials"],
];

export default function ClientView({
  json,
  rates,
  baseCurrency,
}: {
  json: components["schemas"]["CountryData"];
  rates: components["schemas"]["WorldRates"];
  baseCurrency: string;
}) {
  const { country } = useParams<{ country: CountryCode }>();
  const searchParams = useSearchParams();

  const lang: Language = useMemo(
    () => parseLang(searchParams.get("lang")),
    [searchParams],
  );

  const availableCurrencies = useMemo(() => {
    const set = new Set<string>();
    if (baseCurrency) set.add(baseCurrency);
    if (rates?.rates) Object.keys(rates.rates).forEach((c) => set.add(c));
    return Array.from(set);
  }, [rates, baseCurrency]);

  const currency = useMemo(() => {
    const requested = (searchParams.get("currency") || "").toUpperCase();
    if (requested && availableCurrencies.includes(requested)) return requested;
    if (baseCurrency && availableCurrencies.includes(baseCurrency)) {
      return baseCurrency;
    }
    return DEFAULT_CURRENCY;
  }, [searchParams, availableCurrencies, baseCurrency]);

  const countryName = countriesJson[country].names[lang];
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <h1 className="sr-only">
        {TITLE_PREFIX[lang]} {countryName}
      </h1>

      <div className="flex flex-col gap-6">
        {sectionGroups.map((group, i) => {
          const visibleGroup = group.filter(
            (sectionKey) => json[sectionKey]?.length,
          );
          if (!visibleGroup.length) return null;

          return (
            <div key={i} className="flex flex-wrap gap-6">
              {visibleGroup.map((sectionKey) => {
                const list = json[sectionKey];
                if (!list?.length) return null;

                return (
                  <section
                    key={sectionKey}
                    className="flex min-w-0 flex-1 basis-[34rem]"
                  >
                    <OfficialsList
                      baseCurrency={baseCurrency}
                      currency={currency}
                      lang={lang}
                      officials={list}
                      parties={json.parties}
                      rates={rates}
                      sectionKey={sectionKey}
                      title={SECTION_TITLES[sectionKey][lang]}
                    />
                  </section>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
