// src/app/[country]/[year]/ClientView.tsx

"use client";

import OfficialsList from "@/components/OfficialsList";
import countriesJson from "@/data/countries.json";
import { FOOTER_MESSAGE, SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import type { CountryCode, Data, Official, Rates, SectionKey } from "@/types";
import { parseLang, type Language } from "@/validators/lang";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const sectionGroups: SectionKey[][] = [
  ["president", "vicePresident", "royalty"],
  ["ministers"],
  ["senate", "congress"],
  ["officials"],
];

export default function ClientView({
  json,
  rates,
  baseCurrency,
}: {
  json: Data;
  rates: Rates;
  baseCurrency: string;
}) {
  const { country } = useParams<{ country: CountryCode }>();
  const searchParams = useSearchParams();

  // Lang from query (validated)
  const lang: Language = useMemo(
    () => parseLang(searchParams.get("lang")),
    [searchParams]
  );

  // Build available currencies from API (rates + baseCurrency)
  const availableCurrencies = useMemo(() => {
    const set = new Set<string>();
    if (baseCurrency) set.add(baseCurrency);
    if (rates?.rates) Object.keys(rates.rates).forEach((c) => set.add(c));
    return Array.from(set);
  }, [rates, baseCurrency]);

  // Currency from query if present & available; else baseCurrency; else DEFAULT_CURRENCY
  const currency = useMemo(() => {
    const requested = (searchParams.get("currency") || "").toUpperCase();
    if (requested && availableCurrencies.includes(requested)) return requested;
    if (baseCurrency && availableCurrencies.includes(baseCurrency))
      return baseCurrency;
    return DEFAULT_CURRENCY;
  }, [searchParams, availableCurrencies, baseCurrency]);

  const countryName = countriesJson[country]?.names?.[lang] ?? country;

  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <div>
      <div className="p-6 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-semibold">
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

        <p className="text-xs text-muted-foreground ">
          Format ({currency}) -{" "}
          <strong>
            {(12345.6789).toLocaleString(undefined, {
              minimumFractionDigits: currency === "BTC" ? 4 : 0,
              maximumFractionDigits: currency === "BTC" ? 4 : 0,
            })}{" "}
            {CURRENCY_SYMBOLS[currency]}
          </strong>
        </p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center">
        {sectionGroups.map((group, i) => (
          <div key={i} className="flex flex-wrap justify-center gap-8">
            {group.map((sectionKey) => {
              const list = json[sectionKey] as Official[] | undefined;
              if (!list?.length) return null;

              return (
                <section key={sectionKey}>
                  <OfficialsList
                    title={SECTION_TITLES[sectionKey][lang]}
                    officials={list}
                    parties={json.parties}
                    rates={rates}
                    baseCurrency={baseCurrency}
                    selectedCurrency={currency}
                    lang={lang}
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
