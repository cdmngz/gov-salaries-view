// src/app/[country]/[year]/ClientView.tsx

"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import OfficialsList from "@/components/OfficialsList";
import countriesJson from "@/data/countries.json";
import { FOOTER_MESSAGE, SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
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
    [searchParams]
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
    if (baseCurrency && availableCurrencies.includes(baseCurrency))
      return baseCurrency;
    return DEFAULT_CURRENCY;
  }, [searchParams, availableCurrencies, baseCurrency]);

  const countryName = countriesJson[country].names[lang];

  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <div>
      <div className="my-4 pb-6 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-light">
          {TITLE_PREFIX[lang]} {countryName}
        </h2>
        <p className="text-muted-foreground text-xs">
          {before}
          <Link
            href="https://github.com/cdmngz/gov-salaries-data"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            data
          </Link>
          {after}
        </p>
      </div>

      <div className="flex flex-col flex-wrap gap-12 justify-center">
        {sectionGroups.map((group, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-12">
            {group.map((sectionKey) => {
              const list = json[sectionKey];

              if (!list?.length) return null;

              return (
                <section key={sectionKey}>
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
        ))}
      </div>
    </div>
  );
}
