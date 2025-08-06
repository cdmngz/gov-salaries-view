// src/components/OfficialsList.tsx

"use client";

import Portrait from "@/components/Portrait";
import { TEXT_TRANSLATION } from "@/i18n";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { DEFAULT_LANG } from "@/lib/constants";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import { compareSalaryRatio, convert } from "@/lib/utils";
import type { Official, PartyMeta, Rates } from "@/types";
import { Language } from "@/validators/lang";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const ITEMS_LIMIT = 5;

export default function OfficialsList({
  baseCurrency,
  lang,
  officials,
  onSelect,
  parties,
  rates,
  selectedCurrency,
  title,
  userSalary,
}: {
  baseCurrency: string;
  lang: Language;
  officials: Official[];
  onSelect?: (official: Official) => void;
  parties: Record<string, PartyMeta>;
  rates: Rates;
  selectedCurrency: string;
  title: string;
  userSalary: number | null;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={officials.length <= ITEMS_LIMIT ? [title] : []}
      className="flex flex-col p-4 rounded-2xl items-center gap-2  bg-white dark:bg-zinc-900 w-fit"
    >
      <AccordionItem value={title} key={title}>
        <AccordionTrigger className="text-center hover:no-underline flex justify-center">
          <h2 className="text-2xl font-medium mb-2">
            {title} {officials.length > ITEMS_LIMIT && `(${officials.length})`}
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex w-fit gap-6 flex-wrap justify-center">
            {officials.map((official) => {
              const gross = convert(
                official.salary.gross,
                baseCurrency,
                selectedCurrency,
                rates.rates
              );
              const net = convert(
                official.salary.net,
                baseCurrency,
                selectedCurrency,
                rates.rates
              );
              const budget = convert(
                official.budget,
                baseCurrency,
                selectedCurrency,
                rates.rates
              );
              const ratio = compareSalaryRatio(gross, userSalary);

              return (
                <li key={official.name} className="flex justify-center">
                  <div
                    onClick={() => onSelect?.(official)}
                    className="flex flex-col items-center"
                  >
                    <Portrait official={official} parties={parties} />

                    <p className="mt-2 text-center text-sm font-medium">
                      {official.name}
                    </p>

                    {official.district && (
                      <div className="text-xs text-gray-600 border rounded-md p-1 dark:text-white text-center max-w-48">
                        <p className="text-center text-xs ">
                          {official.district}
                        </p>
                      </div>
                    )}

                    {official.role && (
                      <div className="text-xs text-gray-600 border rounded-md p-1 dark:text-white text-center w-48">
                        <p>
                          {ROLE_TRANSLATIONS[official.role]?.[lang] ??
                            official.role}
                        </p>
                        {budget > 0 && (
                          <p>
                            Anual:{" "}
                            {budget.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {CURRENCY_SYMBOLS[selectedCurrency]}
                          </p>
                        )}
                      </div>
                    )}

                    {official.party && parties[official.party] && (
                      <p
                        className="text-xs text-center w-48 font-semibold"
                        style={{ color: parties[official.party].color }}
                      >
                        {official.party} - {parties[official.party].name}
                      </p>
                    )}

                    {official.party &&
                      parties[official.party] &&
                      parties[official.party].en &&
                      lang === DEFAULT_LANG && (
                        <p
                          className="text-xs text-center w-48 font-semibold"
                          style={{ color: parties[official.party].color }}
                        >
                          ({parties[official.party][DEFAULT_LANG]})
                        </p>
                      )}

                    <p className="text-xs">
                      Gross:{" "}
                      {gross.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {CURRENCY_SYMBOLS[selectedCurrency]}
                    </p>
                    {/* {official.salary.detail && (
                  <ul className="text-xs dark:text-white text-gray-400 list-disc">
                    {Object.entries(official.salary.detail).map(
                      ([detail, amount]) => (
                        <li key={detail}>
                          {detail} ({amount})
                        </li>
                      )
                    )}
                  </ul>
                )} */}
                    <p className="text-xs">
                      Net: ~
                      {net.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {CURRENCY_SYMBOLS[selectedCurrency]}
                    </p>

                    {ratio && (
                      <p className="text-xs font-semibold text-blue-600">
                        x{ratio} {TEXT_TRANSLATION["your salary"][lang]}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
