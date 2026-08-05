// src/app/[country]/[year]/ClientView.tsx

"use client";

import { Globe2, Layers3, Sparkles, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import OfficialsList from "@/components/OfficialsList";
import { Card, CardContent } from "@/components/ui/card";
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
    if (baseCurrency && availableCurrencies.includes(baseCurrency)) {
      return baseCurrency;
    }
    return DEFAULT_CURRENCY;
  }, [searchParams, availableCurrencies, baseCurrency]);

  const countryName = countriesJson[country].names[lang];
  const sections = useMemo(
    () =>
      sectionGroups
        .flat()
        .map((key) => ({ key, list: json[key] }))
        .filter((entry) => entry.list?.length),
    [json]
  );
  const totalOfficials = useMemo(
    () => sections.reduce((sum, section) => sum + (section.list?.length ?? 0), 0),
    [sections]
  );

  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <Card className="overflow-hidden border-border/70 bg-linear-to-br from-background via-background to-primary/5 py-0 shadow-xl shadow-black/5">
        <CardContent className="relative p-5 sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-r from-primary/12 via-transparent to-sky-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                Modernized salary explorer
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {TITLE_PREFIX[lang]} {countryName}
                </h1>
                <p className="max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">
                  Browse public compensation data in a cleaner, more visual view
                  with faster scanning, clearer party filters, and denser cards.
                </p>
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {before}
                <Link
                  href="https://github.com/cdmngz/gov-salaries-data"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition hover:text-primary"
                >
                  data
                </Link>
                {after}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur-sm">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Layers3 className="size-3.5" />
                  Sections
                </div>
                <p className="text-xl font-semibold tracking-tight">{sections.length}</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur-sm">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Globe2 className="size-3.5" />
                  Currency views
                </div>
                <p className="text-xl font-semibold tracking-tight">
                  {availableCurrencies.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur-sm">
                <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Wallet className="size-3.5" />
                  Total entries
                </div>
                <p className="text-xl font-semibold tracking-tight">{totalOfficials}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {sectionGroups.map((group, i) => {
          const visibleGroup = group.filter((sectionKey) => json[sectionKey]?.length);
          if (!visibleGroup.length) return null;

          return (
            <div key={i} className="grid gap-6 xl:grid-cols-2">
              {visibleGroup.map((sectionKey) => {
                const list = json[sectionKey];
                if (!list?.length) return null;

                return (
                  <section key={sectionKey} className="flex">
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
          );
        })}
      </div>
    </div>
  );
}
