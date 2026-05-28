// src/components/OfficialsList.tsx

"use client";

import { Filter, Layers3, Landmark, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";

import Portrait from "@/components/Portrait";
import { SourcesButton } from "@/components/SourcesButton";
import { Card, CardContent } from "@/components/ui/card";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { DEFAULT_LANG } from "@/lib/constants";
import { cn, convert, formatCurrency } from "@/lib/utils";
import { SectionKey } from "@/types";
import { components } from "@/types/openapi";
import { Language } from "@/validators/lang";

type Official = components["schemas"]["Official"];
type Parties = components["schemas"]["Parties"];
type Rates = components["schemas"]["WorldRates"];
type Party = components["schemas"]["Official"]["party"];
type RangeGroupId = (typeof rangeGroups)[number]["id"];

const NO_PARTY_KEY = "__NO_PARTY__";
const NO_PARTY_LABEL = "No party";

const rangeGroups = [
  {
    id: "1-2",
    label: "Left",
    summary: "Progressive and center-left parties",
    inGroup: (r: number) => r >= 1 && r <= 2,
    className:
      "border-rose-200/70 bg-linear-to-br from-rose-500/10 via-background to-rose-50/60 dark:border-rose-500/20 dark:from-rose-500/15 dark:to-rose-950/30",
  },
  {
    id: "3",
    label: "Center",
    summary: "Centrist, independent, and uncategorized",
    inGroup: (r: number) => r === 3,
    className:
      "border-amber-200/70 bg-linear-to-br from-amber-400/10 via-background to-amber-50/60 dark:border-amber-500/20 dark:from-amber-400/10 dark:to-amber-950/30",
  },
  {
    id: "4-5",
    label: "Right",
    summary: "Center-right and conservative parties",
    inGroup: (r: number) => r >= 4 && r <= 5,
    className:
      "border-sky-200/70 bg-linear-to-br from-sky-500/10 via-background to-sky-50/60 dark:border-sky-500/20 dark:from-sky-500/15 dark:to-sky-950/30",
  },
] as const;

const rangeIcons: Record<number, string> = {
  1: "←",
  2: "↖",
  3: "↑",
  4: "↗",
  5: "→",
};

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
    <li className="h-full">
      <Card className="group h-full overflow-hidden border-border/70 bg-linear-to-br from-background/95 via-background/90 to-primary/5 py-0 shadow-sm shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-black/10 dark:from-card/95 dark:to-primary/10">
        <CardContent className="flex h-full flex-col items-center gap-4 p-5 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/15 to-transparent blur-xl" />
            <Portrait official={official} parties={parties} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="max-w-56 text-sm font-semibold tracking-tight sm:text-base">
                {official.name}
              </span>
              <SourcesButton sources={official.sources} />
            </div>

            {official.role && (
              <p className="text-sm text-muted-foreground">
                {ROLE_TRANSLATIONS[official.role]?.[lang] ?? official.role}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {official.district && (
              <span className="rounded-full border border-border/70 bg-secondary/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                {official.district}
              </span>
            )}

            {official.party && partyMeta && (
              <span
                className="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                style={{ backgroundColor: partyMeta.color }}
              >
                {official.party} {rangeIcon ? `· ${rangeIcon}` : ""}
              </span>
            )}
          </div>

          {(partyMeta?.name || partyMeta?.[DEFAULT_LANG]) && (
            <div className="space-y-1 text-xs text-muted-foreground">
              {partyMeta?.name && <p>{partyMeta.name}</p>}
              {partyMeta?.[DEFAULT_LANG] && (
                <p className="font-light">{partyMeta[DEFAULT_LANG]}</p>
              )}
            </div>
          )}

          <div className="mt-auto grid w-full gap-2 rounded-2xl border border-border/60 bg-secondary/40 p-3 text-left backdrop-blur-sm">
            {official.salary?.gross && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Gross salary</span>
                <span className="min-w-0 flex-1 break-words text-right font-semibold tracking-tight leading-tight">
                  {formatCurrency(
                    convert(
                      official.salary.gross,
                      baseCurrency,
                      currency,
                      rates.rates
                    ),
                    currency
                  )}
                </span>
              </div>
            )}

            {official.budget && (
              <div className="flex items-start justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Budget</span>
                <span className="min-w-0 flex-1 break-words text-right font-semibold tracking-tight leading-tight">
                  {formatCurrency(
                    convert(official.budget, baseCurrency, currency, rates.rates),
                    currency
                  )}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
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
    <div className="flex flex-wrap gap-2 justify-center">
      <button
        onClick={onReset}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
          allSelected
            ? "border-primary/80 bg-primary text-primary-foreground shadow-sm"
            : "border-border/80 bg-background/70 text-foreground/80 hover:border-foreground/30 hover:bg-secondary"
        )}
      >
        Show all parties
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
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium text-nowrap transition-all duration-200",
              isActive
                ? "border-transparent text-white shadow-md"
                : "border-border/70 bg-background/75 hover:border-foreground/15 hover:bg-background"
            )}
            style={
              isActive && party?.color
                ? { backgroundColor: party.color }
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

  const stats = useMemo(
    () => ({
      withParty: officials.filter((official) => official.party).length,
      withSalary: officials.filter((official) => official.salary?.gross).length,
    }),
    [officials]
  );

  const partyDistribution = useMemo(
    () => [
      {
        ...rangeGroups[0],
        count: filterByRangeId(officials, parties, "1-2").length,
        data: filterByRangeId(officials, parties, "1-2"),
      },
      {
        ...rangeGroups[1],
        count: filterByRangeIdAllowNull(officials, parties, "3").length,
        data: filterByRangeIdAllowNull(officials, parties, "3"),
      },
      {
        ...rangeGroups[2],
        count: filterByRangeId(officials, parties, "4-5").length,
        data: filterByRangeId(officials, parties, "4-5"),
      },
    ],
    [officials, parties]
  );

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
    <Card className="w-full border-border/70 bg-card/75 py-0 shadow-lg shadow-black/5 backdrop-blur-md">
      <CardContent className="space-y-6 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              <Landmark className="size-3.5" />
              {title}
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {officials.length} officials in this section
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Explore current salaries, roles, parties, and district details in
                a denser, easier-to-scan layout.
              </p>
            </div>
          </div>

          <div className="top-2 z-10 flex flex-wrap gap-2 rounded-2xl border border-border/60 bg-background/80 p-1 backdrop-blur supports-[backdrop-filter]:bg-background/65 lg:sticky lg:justify-end">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-4 py-2 text-xs font-medium transition hover:bg-secondary"
            >
              <Layers3 className="size-3.5" />
              {showInfo ? "Collapse section" : "Expand section"}
            </button>
            {showFilterButton && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/75 px-4 py-2 text-xs font-medium transition hover:bg-secondary"
              >
                <Filter className="size-3.5" />
                {showFilters ? "Hide filters" : "Show filters"}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Users className="size-3.5" />
              Visible cards
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {visibleOfficials.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" />
              With party data
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {stats.withParty}
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4 backdrop-blur-sm">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5" />
              With salary data
            </div>
            <p className="text-2xl font-semibold tracking-tight">
              {stats.withSalary}
            </p>
          </div>
        </div>

        {showInfo && (
          <>
            {showFilters && showFilterButton && (
              <div className="grid gap-3 xl:grid-cols-3">
                {partyDistribution.map((group) => (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-2xl border p-4 shadow-sm shadow-black/5 backdrop-blur-sm",
                      group.className
                    )}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold tracking-tight">
                          {group.label}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {group.summary}
                        </p>
                      </div>
                      <span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium">
                        {group.count}
                      </span>
                    </div>

                    <PartyButtons
                      className={cn(
                        group.id === "4-5" &&
                          "justify-start xl:justify-end"
                      )}
                      data={group.data}
                      onToggle={toggleParty}
                      parties={parties}
                      selected={selectedParties}
                    />
                  </div>
                ))}
              </div>
            )}

            {showFilters && showFilterButton && (
              <PartyChipsMulti
                selected={selectedParties}
                onReset={() => setSelectedParties(new Set())}
              />
            )}

            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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
      </CardContent>
    </Card>
  );
}
