// src/components/CountryPageBody.tsx

"use client";

import OfficialsList from "@/components/OfficialsList";
import { FOOTER_MESSAGE, SECTION_TITLES, TITLE_PREFIX } from "@/i18n";
import { DEFAULT_LANG } from "@/lib/constants";
import type { CountryCode, Data, Official, Rates, SectionKey } from "@/types";
import type { Language } from "@/validators/lang";
import countriesJson from "../data/countries.json";
import Link from "next/link";

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
  // const [userSalary, setUserSalary] = useState<number | null>(null);
  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-semibold">
        {TITLE_PREFIX[lang] ?? TITLE_PREFIX[DEFAULT_LANG]}{" "}
        {countriesJson[country].names[lang] ??
          countriesJson[country].names[DEFAULT_LANG] ??
          country}
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
      {/* <div className="flex flex-col items-end w-full space-y-1">
        <label htmlFor="salaryInput" className="text-xs text-gray-600">
          {TEXT_TRANSLATION["compare your salary"][lang]}
        </label>
        <Input
          id="salaryInput"
          type="number"
          className="w-32 bg-white"
          min="0"
          onChange={(e) =>
            setUserSalary(e.target.value ? Number(e.target.value) : null)
          }
        />
      </div> */}
      {sectionGroups.map((group, i) => (
        <div key={i} className="flex flex-wrap justify-center gap-8">
          {group.map((sectionKey) => {
            const list = json[sectionKey] as Official[];
            if (!list || list.length === 0) return null;

            return (
              <OfficialsList
                baseCurrency={baseCurrency}
                key={sectionKey}
                lang={lang}
                officials={list}
                parties={json.parties}
                rates={rates}
                selectedCurrency={selectedCurrency}
                title={SECTION_TITLES[sectionKey][lang]}
                // userSalary={userSalary}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
