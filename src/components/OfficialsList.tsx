// src/components/OfficialsList.tsx

"use client";

import Portrait from "@/components/Portrait";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { DEFAULT_LANG } from "@/lib/constants";
import { convert, formatCurrency } from "@/lib/utils";
import { components } from "@/types/openapi";
import { Language } from "@/validators/lang";
import { SourcesButton } from "./SourcesButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const MAX_OFFICIALS_LIMIT = 15;

const ranges: Record<number, string> = {
  1: "←",
  2: "↖",
  3: "↑",
  4: "➚",
  5: "→",
};

export default function OfficialsList({
  baseCurrency,
  lang,
  officials,
  onSelect,
  parties,
  rates,
  currency,
  title,
}: {
  baseCurrency: string;
  lang: Language;
  officials: components["schemas"]["Official"][];
  onSelect?: (official: components["schemas"]["Official"]) => void;
  parties?: components["schemas"]["Parties"];
  rates: components["schemas"]["Rates"];
  currency: string;
  title: string;
}) {
  return (
    <Accordion
      type="multiple"
      defaultValue={officials.length <= MAX_OFFICIALS_LIMIT ? [title] : []}
      className="flex flex-col p-4 rounded-2xl items-center gap-2 bg-card w-fit"
    >
      <AccordionItem value={title} key={title}>
        <AccordionTrigger className="text-center hover:no-underline flex justify-center">
          <h2 className="text-2xl font-medium mb-2">
            {title}{" "}
            {officials.length > MAX_OFFICIALS_LIMIT && `(${officials.length})`}
          </h2>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="flex w-fit gap-6 flex-wrap justify-center">
            {officials.map((official) => {
              return (
                <li key={official.name} className="flex justify-center">
                  <div
                    onClick={() => onSelect?.(official)}
                    className="flex flex-col items-center"
                  >
                    <Portrait official={official} parties={parties} />

                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">
                        {official.name}
                      </span>
                      <SourcesButton sources={official.sources} />
                    </div>

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
                        {official.budget && (
                          <p>
                            Anual:{" "}
                            {formatCurrency(
                              convert(
                                official.budget,
                                baseCurrency,
                                currency,
                                rates.rates
                              ),
                              currency
                            )}
                          </p>
                        )}
                      </div>
                    )}

                    {official.party && parties && parties[official.party] && (
                      <p
                        className="text-xs text-center w-48 font-semibold"
                        style={{ color: parties[official.party].color }}
                      >
                        {official.party} {ranges[parties[official.party].range]}{" "}
                        {parties[official.party].name}{" "}
                      </p>
                    )}

                    {official.party &&
                      parties &&
                      parties[official.party]?.en && (
                        <p
                          className="text-xs text-center w-48 font-light"
                          style={{ color: parties[official.party].color }}
                        >
                          ({parties[official.party][DEFAULT_LANG]})
                        </p>
                      )}

                    {official.salary?.gross && (
                      <p className="text-xs flex gap-1 items-center">
                        Gross:{" "}
                        {formatCurrency(
                          convert(
                            official.salary.gross,
                            baseCurrency,
                            currency,
                            rates.rates
                          ),
                          currency
                        )}
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
