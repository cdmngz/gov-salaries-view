"use client";

import Portrait from "@/components/Portrait";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { DEFAULT_LANG } from "@/lib/constants";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import { convert } from "@/lib/utils";
import type { Official, PartyMeta, Rates } from "@/types";
import { Language } from "@/validators/lang";

export default function OfficialsList({
  title,
  officials,
  lang,
  onSelect,
  baseCurrency,
  selectedCurrency,
  rates,
  parties,
}: {
  title: string;
  officials: Official[];
  lang: Language;
  onSelect?: (official: Official) => void;
  baseCurrency: string;
  selectedCurrency: string;
  rates: Rates;
  parties: Record<string, PartyMeta>;
}) {
  return (
    <section className="flex flex-col p-4 rounded-2xl items-center gap-2  bg-white dark:bg-zinc-900 w-fit">
      <h2 className="text-2xl font-semibold mb-2">
        {title} {officials.length > 5 && `(${officials.length})`}
      </h2>

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
                    <p className="text-center text-xs ">{official.district}</p>
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
                    className="text-xs text-center w-48 font-medium"
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
                      className="text-xs text-center w-48 font-medium"
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
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
