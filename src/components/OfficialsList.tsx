// src/components/OfficialsList.tsx

"use client";

import { useMemo, useState } from "react";

import Portrait from "@/components/Portrait";
import { SourcesButton } from "@/components/SourcesButton";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { DEFAULT_LANG } from "@/lib/constants";
import { cn, convert, formatCurrency } from "@/lib/utils";
import { SectionKey } from "@/types";
import { components } from "@/types/openapi";
import { Language } from "@/validators/lang";

type Official = components["schemas"]["Official"];
type Parties = components["schemas"]["Parties"];
type Rates = components["schemas"]["Rates"];
type Party = components["schemas"]["Official"]["party"];

const NO_PARTY_KEY = "__NO_PARTY__";
const NO_PARTY_LABEL = "No party";

const rangeIcons: Record<number, string> = {
  1: "←",
  2: "↖",
  3: "↑",
  4: "↗",
  5: "→",
};

const rangeGroups = [
  { id: "1-2", label: "1-2", inGroup: (r: number) => r >= 1 && r <= 2 },
  { id: "3", label: "3", inGroup: (r: number) => r === 3 },
  { id: "4-5", label: "4-5", inGroup: (r: number) => r >= 4 && r <= 5 },
] as const;

type RangeGroupId = (typeof rangeGroups)[number]["id"];

function getPartyRange(party: Party, parties?: Parties): number | null {
  if (!party) return null;
  const p = parties?.[party];
  return p?.range ? p.range : null;
}

function filterByRangeId(
  officials: Official[],
  parties: Parties | undefined,
  rangeId: RangeGroupId
) {
  const group = rangeGroups.find((g) => g.id === rangeId);
  if (!group) return [];
  return officials.filter((official) => {
    const r = getPartyRange(official.party, parties);
    return r != null && group.inGroup(r);
  });
}

function filterByRangeIdAllowNull(
  officials: Official[],
  parties: Parties | undefined,
  rangeId: RangeGroupId
) {
  const group = rangeGroups.find((g) => g.id === rangeId);
  if (!group) return [];
  return officials.filter((official) => {
    const r = getPartyRange(official.party, parties);
    return r == null || group.inGroup(r);
  });
}

function OfficialCard({
  official,
  parties,
  baseCurrency,
  currency,
  rates,
  lang,
}: {
  official: Official;
  parties?: Parties;
  baseCurrency: string;
  currency: string;
  rates: Rates;
  lang: Language;
}) {
  const partyMeta = official.party ? parties?.[official.party] : undefined;
  const r = getPartyRange(official.party, parties);
  const rangeIcon = typeof r === "number" ? rangeIcons[r] : undefined;

  return (
    <li className="flex justify-center">
      <div className="flex flex-col items-center">
        <Portrait official={official} parties={parties} />
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{official.name}</span>
          <SourcesButton sources={official.sources} />
        </div>

        {official.district && (
          <div className="text-muted-foreground border rounded-none m-1 py-1 px-2 max-w-48">
            <p className="text-center text-xs">{official.district}</p>
          </div>
        )}

        {official.role && (
          <div className="text-xs text-muted-foreground rounded p-1 text-center w-48">
            <p>
              {ROLE_TRANSLATIONS[official.role as string]?.[lang] ??
                official.role}
            </p>
            {official.budget && (
              <p>
                Budget:{" "}
                {formatCurrency(
                  convert(official.budget, baseCurrency, currency, rates.rates),
                  currency
                )}
              </p>
            )}
          </div>
        )}

        {official.party && partyMeta && (
          <>
            <p
              className="text-xs text-center w-48 font-semibold"
              style={{ color: partyMeta.color }}
            >
              {official.party} {rangeIcon} {partyMeta.name}
            </p>
            {partyMeta[DEFAULT_LANG] && (
              <p
                className="text-xs text-center w-48 font-light"
                style={{ color: partyMeta.color }}
              >
                ({partyMeta[DEFAULT_LANG]})
              </p>
            )}
          </>
        )}

        {official.salary?.gross && (
          <p className="text-xs flex p-1 items-center">
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
}

function PartyChipsMulti({
  selected,
  onReset,
}: {
  selected: Set<string>;
  onReset: () => void;
}) {
  const allSelected = selected.size === 0;
  return (
    <div className="flex flex-wrap gap-2 max-w-3xl justify-center">
      <button
        onClick={onReset}
        className={[
          "px-3 py-1 rounded-full text-xs border transition",
          allSelected
            ? "bg-foreground text-background border-foreground"
            : "bg-transparent text-foreground/80 border-foreground/30 hover:border-foreground/60",
        ].join(" ")}
      >
        All parties
      </button>
    </div>
  );
}

function PartyButtons({
  className,
  data,
  onToggle,
  parties,
  selected,
}: {
  className?: string;
  data: Official[];
  onToggle: (party: string) => void;
  parties?: Parties;
  selected: Set<string>;
}) {
  const { partyList, counts } = useMemo(() => {
    const set = new Set<string>();
    const counts: Record<string, number> = {};
    for (const m of data) {
      const partyKey = m.party ?? NO_PARTY_KEY;
      set.add(partyKey);
      counts[partyKey] = (counts[partyKey] ?? 0) + 1;
    }
    return { partyList: Array.from(set).sort(), counts };
  }, [data]);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {partyList.map((partyKey) => {
        const label = partyKey === NO_PARTY_KEY ? NO_PARTY_LABEL : partyKey;
        const isActive = selected.size > 0 && selected.has(partyKey);
        const party = parties?.[partyKey];
        const rangeIcon =
          typeof party?.range === "number"
            ? rangeIcons[party?.range]
            : undefined;
        return (
          <button
            onClick={() => onToggle(partyKey)}
            key={partyKey}
            className="px-3 py-1 rounded-full text-nowrap shadow-none text-xs border-none bg-card"
            style={
              isActive && party?.color
                ? { backgroundColor: party.color, color: "white" }
                : { color: party?.color }
            }
          >
            {label} ({counts[partyKey]}) {rangeIcon}
          </button>
        );
      })}
    </div>
  );
}

export default function OfficialsList({
  baseCurrency,
  currency,
  lang,
  officials,
  parties,
  rates,
  sectionKey,
  title,
}: {
  baseCurrency: string;
  currency: string;
  lang: Language;
  officials: Official[];
  parties?: Parties;
  rates: Rates;
  sectionKey: SectionKey;
  title: string;
}) {
  const showFilterButton =
    sectionKey !== "royalty" && sectionKey !== "executive";

  const [selectedParties, setSelectedParties] = useState<Set<string>>(
    new Set()
  );
  const [showFilters, setShowFilters] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const toggleParty = (p: string) => {
    setSelectedParties((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  };

  const visibleOfficials = useMemo(() => {
    if (selectedParties.size === 0) return officials;
    return officials.filter((o) =>
      o.party ? selectedParties.has(o.party) : selectedParties.has(NO_PARTY_KEY)
    );
  }, [officials, selectedParties]);

  return (
    <div className="flex flex-col py-4 px-8 items-center gap-4 bg-card rounded-none w-fit">
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-semibold">
          {title} ({officials.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-3 py-1 rounded-full text-xs border border-foreground/30 hover:border-foreground/60"
          >
            {showInfo ? "Hide" : "Show"}
          </button>
          {showFilterButton && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 rounded-full text-xs border border-foreground/30 hover:border-foreground/60"
            >
              Filters
            </button>
          )}
        </div>
      </div>
      {showInfo && (
        <>
          {showFilters && showFilterButton && (
            <div className="flex gap-4 w-full flex-wrap">
              <div className="min-h-18 flex-1 flex flex-col gap-2 p-2 items-start bg-red-100">
                <p className="text-sm dark:text-primary-foreground">
                  Left (
                  {
                    officials.filter((official) =>
                      filterByRangeId(officials, parties, "1-2").includes(
                        official
                      )
                    ).length
                  }
                  )
                </p>
                <PartyButtons
                  data={filterByRangeId(officials, parties, "1-2")}
                  onToggle={toggleParty}
                  parties={parties}
                  selected={selectedParties}
                />
              </div>
              <div className="min-h-18 flex-1 flex flex-col gap-2 p-2 items-center bg-muted">
                <p className="text-sm">
                  Center (
                  {
                    officials.filter((official) =>
                      filterByRangeIdAllowNull(
                        officials,
                        parties,
                        "3"
                      ).includes(official)
                    ).length
                  }
                  )
                </p>
                <PartyButtons
                  data={filterByRangeIdAllowNull(officials, parties, "3")}
                  onToggle={toggleParty}
                  parties={parties}
                  selected={selectedParties}
                />
              </div>
              <div className="min-h-18 flex-1 flex flex-col  gap-2 p-2 items-end bg-blue-100">
                <p className="text-sm dark:text-primary-foreground">
                  Right (
                  {
                    officials.filter((official) =>
                      filterByRangeId(officials, parties, "4-5").includes(
                        official
                      )
                    ).length
                  }
                  )
                </p>
                <PartyButtons
                  className="flex justify-end items-end flex-wrap"
                  data={filterByRangeId(officials, parties, "4-5")}
                  onToggle={toggleParty}
                  parties={parties}
                  selected={selectedParties}
                />
              </div>
            </div>
          )}

          {showFilters && showFilterButton && (
            <PartyChipsMulti
              selected={selectedParties}
              onReset={() => setSelectedParties(new Set())}
            />
          )}

          <ul className="grid gap-4 mt-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 w-full">
            {visibleOfficials.map((o) => (
              <OfficialCard
                key={`${o.name}-${o.role}`}
                official={o}
                parties={parties}
                baseCurrency={baseCurrency}
                currency={currency}
                rates={rates}
                lang={lang}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
