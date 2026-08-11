// src/components/OfficialsList.tsx

"use client";

import {
  ChevronDown,
  ChevronUp,
  Landmark,
  Sparkles,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import Portrait from "@/components/Portrait";
import { SourcesButton } from "@/components/SourcesButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROLE_TRANSLATIONS } from "@/i18n/roles";
import { cn, convert, formatCurrency } from "@/lib/utils";
import { SectionKey } from "@/types";
import { components } from "@/types/openapi";
import { Language } from "@/validators/lang";

type Official = components["schemas"]["Official"];
type Parties = components["schemas"]["Parties"];
type Rates = components["schemas"]["WorldRates"];
type Party = components["schemas"]["Official"]["party"];
type PartyMetadata = components["schemas"]["Party"];
type RangeGroupId = (typeof rangeGroups)[number]["id"];
type DataFilter = "party" | "noParty" | "salary" | "noSalary";

const NO_PARTY_KEY = "__NO_PARTY__";
const NO_PARTY_LABEL = "No party";

const rangeGroups = [
  {
    id: "1-2",
    label: "Left",
    summary: "Progressive and center-left parties",
    inGroup: (r: number) => r >= 1 && r <= 2,
    className: "border-rose-200/70 bg-rose-500/5 dark:border-rose-500/20",
  },
  {
    id: "3",
    label: "Center",
    summary: "Centrist, independent, and uncategorized",
    inGroup: (r: number) => r === 3,
    className: "border-amber-200/70 bg-amber-400/5 dark:border-amber-500/20",
  },
  {
    id: "4-5",
    label: "Right",
    summary: "Center-right and conservative parties",
    inGroup: (r: number) => r >= 4 && r <= 5,
    className: "border-sky-200/70 bg-sky-500/5 dark:border-sky-500/20",
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
  rangeId: RangeGroupId,
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
  rangeId: RangeGroupId,
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
  const localizedPartyName = partyMeta
    ? ((partyMeta as PartyMetadata & Partial<Record<Language, string>>)[lang] ??
      partyMeta.name)
    : undefined;
  const englishPartyName = partyMeta?.en ?? partyMeta?.name;

  return (
    <li className="min-w-56 flex-1 basis-56">
      <Card className="group h-full overflow-hidden py-0 shadow-none transition-colors hover:border-primary/30">
        <CardContent className="flex h-full flex-col items-center gap-3 p-4 text-center">
          <Portrait official={official} parties={parties} />

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="max-w-52 text-xs font-semibold tracking-tight sm:text-sm">
                {official.name}
              </span>
              <SourcesButton sources={official.sources} />
            </div>

            {official.role && (
              <p className="text-xs text-muted-foreground">
                {ROLE_TRANSLATIONS[official.role]?.[lang] ?? official.role}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {official.district && (
              <Badge
                variant="secondary"
                className="rounded-full text-[11px] font-normal text-muted-foreground"
              >
                {official.district}
              </Badge>
            )}

            {official.party && partyMeta && (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      className="cursor-help rounded-full border-transparent text-[11px] text-white"
                      style={{ backgroundColor: partyMeta.color }}
                      tabIndex={0}
                      aria-label={`${official.party}: ${localizedPartyName}`}
                    >
                      {official.party} {rangeIcon ? `· ${rangeIcon}` : ""}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-72 text-xs">
                    <p className="font-semibold">{official.party}</p>
                    {englishPartyName && (
                      <p>
                        <span className="text-muted-foreground">English:</span>{" "}
                        {englishPartyName}
                      </p>
                    )}
                    {localizedPartyName &&
                      (lang !== "en" ||
                        localizedPartyName !== englishPartyName) && (
                        <p>
                          <span className="text-muted-foreground">
                            {lang.toUpperCase()}:
                          </span>{" "}
                          {localizedPartyName}
                        </p>
                      )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="mt-auto grid w-full min-w-0 gap-2 rounded-lg bg-secondary/50 p-2.5 text-left">
            {official.salary?.gross && (
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs">
                <span className="shrink-0 text-muted-foreground">
                  Gross salary
                </span>
                <span className="min-w-0 max-w-full break-words text-right font-semibold leading-tight tracking-tight tabular-nums [overflow-wrap:anywhere]">
                  {formatCurrency(
                    convert(
                      official.salary.gross,
                      baseCurrency,
                      currency,
                      rates.rates,
                    ),
                    currency,
                  )}
                </span>
              </div>
            )}

            {official.budget && (
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 gap-y-1 text-xs">
                <span className="shrink-0 text-muted-foreground">Budget</span>
                <span className="min-w-0 max-w-full break-words text-right font-semibold leading-tight tracking-tight tabular-nums [overflow-wrap:anywhere]">
                  {formatCurrency(
                    convert(
                      official.budget,
                      baseCurrency,
                      currency,
                      rates.rates,
                    ),
                    currency,
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
      <Button
        type="button"
        variant={allSelected ? "default" : "outline"}
        size="sm"
        onClick={onReset}
        className={cn(
          "rounded-full text-xs",
          !allSelected && "text-foreground/80",
        )}
      >
        Show all parties
      </Button>
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onToggle(partyKey)}
            key={partyKey}
            className={cn(
              "rounded-full text-xs",
              isActive
                ? "border-transparent text-white hover:text-white"
                : "bg-background text-foreground",
            )}
            style={
              isActive && party?.color
                ? { backgroundColor: party.color }
                : { color: party?.color }
            }
          >
            {label} ({counts[partyKey]}) {rangeIcon}
          </Button>
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
  const showPartyFilters =
    sectionKey !== "royalty" && sectionKey !== "executive";

  const [selectedParties, setSelectedParties] = useState<Set<string>>(
    new Set(),
  );
  const [showInfo, setShowInfo] = useState(true);
  const [dataFilters, setDataFilters] = useState<Set<DataFilter>>(new Set());

  const stats = useMemo(
    () => ({
      withParty: officials.filter((official) => official.party).length,
      withoutParty: officials.filter((official) => !official.party).length,
      withSalary: officials.filter((official) => official.salary?.gross).length,
      withoutSalary: officials.filter((official) => !official.salary?.gross)
        .length,
    }),
    [officials],
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
    [officials, parties],
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

  const toggleDataFilter = (filter: DataFilter) => {
    setDataFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filter)) {
        next.delete(filter);
      } else {
        if (filter === "party") next.delete("noParty");
        if (filter === "noParty") next.delete("party");
        if (filter === "salary") next.delete("noSalary");
        if (filter === "noSalary") next.delete("salary");
        next.add(filter);
      }
      return next;
    });
  };

  const visibleOfficials = useMemo(() => {
    return officials.filter((official) => {
      const matchesPartySelection =
        selectedParties.size === 0 ||
        (official.party
          ? selectedParties.has(official.party)
          : selectedParties.has(NO_PARTY_KEY));
      const matchesPartyData =
        !dataFilters.has("party") || Boolean(official.party);
      const matchesMissingPartyData =
        !dataFilters.has("noParty") || !official.party;
      const matchesSalaryData =
        !dataFilters.has("salary") || Boolean(official.salary?.gross);
      const matchesMissingSalaryData =
        !dataFilters.has("noSalary") || !official.salary?.gross;

      return (
        matchesPartySelection &&
        matchesPartyData &&
        matchesMissingPartyData &&
        matchesSalaryData &&
        matchesMissingSalaryData
      );
    });
  }, [dataFilters, officials, selectedParties]);

  return (
    <Card className="w-full py-0 shadow-none">
      <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Landmark className="size-4 text-primary" />
            {title}
          </h2>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowInfo(!showInfo)}
            className="text-muted-foreground hover:text-foreground"
            aria-expanded={showInfo}
            aria-label={showInfo ? "Collapse section" : "Expand section"}
            title={showInfo ? "Collapse section" : "Expand section"}
          >
            {showInfo ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border/60 px-3 py-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Users className="size-3.5" />
              Total
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {officials.length}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleDataFilter("party")}
            aria-pressed={dataFilters.has("party")}
            className={cn(
              "h-10 gap-2 rounded-lg px-3 text-xs",
              dataFilters.has("party") && "border-primary bg-primary/8",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Sparkles className="size-3.5" />
              Party
            </span>
            <span className="font-semibold tabular-nums">{stats.withParty}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleDataFilter("noParty")}
            aria-pressed={dataFilters.has("noParty")}
            className={cn(
              "h-10 gap-2 rounded-lg px-3 text-xs",
              dataFilters.has("noParty") && "border-primary bg-primary/8",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" />
              No party
            </span>
            <span className="font-semibold tabular-nums">
              {stats.withoutParty}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleDataFilter("salary")}
            aria-pressed={dataFilters.has("salary")}
            className={cn(
              "h-10 gap-2 rounded-lg px-3 text-xs",
              dataFilters.has("salary") && "border-primary bg-primary/8",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Sparkles className="size-3.5" />
              Salary
            </span>
            <span className="font-semibold tabular-nums">
              {stats.withSalary}
            </span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => toggleDataFilter("noSalary")}
            aria-pressed={dataFilters.has("noSalary")}
            className={cn(
              "h-10 gap-2 rounded-lg px-3 text-xs",
              dataFilters.has("noSalary") && "border-primary bg-primary/8",
            )}
          >
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Users className="size-3.5" />
              No salary
            </span>
            <span className="font-semibold tabular-nums">
              {stats.withoutSalary}
            </span>
          </Button>
        </div>

        {showInfo && (
          <>
            {showPartyFilters && (
              <div className="space-y-2">
                <div className="grid gap-2 xl:grid-cols-3">
                  {partyDistribution.map((group) => (
                    <div
                      key={group.id}
                      className={cn(
                        "min-w-0 rounded-lg border p-2.5",
                        group.className,
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold">{group.label}</p>
                        <Badge
                          variant="outline"
                          className="h-5 rounded-full bg-background px-1.5 text-[10px]"
                        >
                          {group.count}
                        </Badge>
                      </div>

                      <PartyButtons
                        className={cn(
                          group.id === "4-5" && "justify-start xl:justify-end",
                        )}
                        data={group.data}
                        onToggle={toggleParty}
                        parties={parties}
                        selected={selectedParties}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showPartyFilters && (
              <PartyChipsMulti
                selected={selectedParties}
                onReset={() => setSelectedParties(new Set())}
              />
            )}

            <ul className="flex flex-wrap gap-4">
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
            {visibleOfficials.length === 0 && (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No officials match the selected filters.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
