// src/components/CountryPageBody.tsx

"use client";

import OfficialsList from "@/components/OfficialsList";
import countriesJson from "@/data/countries.json";
import { FOOTER_MESSAGE, SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import type { CountryCode, Data, Official, Rates, SectionKey } from "@/types";
import { parseLang } from "@/validators/lang";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const sectionGroups: SectionKey[][] = [
  ["president", "vicePresident", "royalty"],
  ["ministers"],
  ["senate", "congress"],
  ["officials"],
];

type Props = {
  json: Data;
  rates: Rates;
  baseCurrency: string;
};

export default function CountryPageBody({ json, rates, baseCurrency }: Props) {
  const searchParams = useSearchParams();
  const { country } = useParams<{ country: CountryCode }>();

  const lang = parseLang(searchParams.get("lang"));
  const currency = searchParams.get("currency") ?? DEFAULT_CURRENCY;

  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold">
        {TITLE_PREFIX[lang]} {countriesJson[country]?.names?.[lang] ?? country}
      </h1>

      <p className="text-muted-foreground text-xs -mt-7 font-light">
        {before}
        <Link
          href="https://github.com/cdmngz/gov-salaries-data"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the data repository on GitHub"
          className="underline hover:text-blue-600"
        >
          data
        </Link>
        {after}
      </p>

      {sectionGroups.map((group, i) => (
        <div key={i} className="flex flex-wrap justify-center gap-8">
          {group.map((sectionKey) => {
            const list = json[sectionKey] as Official[] | undefined;
            if (!list?.length) return null;

            return (
              <OfficialsList
                key={sectionKey}
                title={SECTION_TITLES[sectionKey][lang]}
                officials={list}
                parties={json.parties}
                rates={rates}
                baseCurrency={baseCurrency}
                selectedCurrency={currency}
                lang={lang}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
