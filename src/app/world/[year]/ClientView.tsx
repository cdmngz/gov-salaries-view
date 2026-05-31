"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Globe2, MapPinned, Table2 } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";
import countriesJson from "@/data/countries.json";
import { TEXT_TRANSLATION } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { rangeCounts } from "@/lib/map-colors";
import { components } from "@/types/openapi";
import { parseLang } from "@/validators/lang";
import { DataTable } from "./DataTable";
import { buildRows } from "./buildRows";
import { buildColumns } from "./buildColumns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GlobeMap3D = dynamic(() => import("./GlobeMap3D"), { ssr: false });
const WorldPoliticalMap = dynamic(() => import("./WorldPoliticalMap"), {
  ssr: false,
});

export default function ClientView({
  data,
  rates,
}: {
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["WorldRates"];
}) {
  const searchParams = useSearchParams();
  const { year } = useParams<{ year: string }>();
  const currency = (
    searchParams.get("currency") ?? DEFAULT_CURRENCY
  ).toUpperCase();
  const lang = parseLang(searchParams.get("lang"));

  const rows = useMemo(
    () => buildRows(data, currency, rates.rates, lang),
    [data, currency, rates.rates, lang]
  );
  const columns = useMemo(
    () => buildColumns({ currency, year, searchParams }),
    [currency, year, searchParams]
  );
  const legendCounts = useMemo(() => rangeCounts(data), [data]);

  const viewTabs = [
    {
      tab: "map-3d",
      label: "3D World Map",
      description: "Interactive globe",
      Icon: Globe2,
    },
    {
      tab: "map-2d",
      label: "World Political Map",
      description: "Flat country view",
      Icon: MapPinned,
    },
    {
      tab: "table",
      label: "Stats Table",
      description: "Sortable records",
      Icon: Table2,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
          World overview
        </p>
        <h1
          className="text-2xl font-light tracking-tight sm:text-3xl"
          data-testid="world-stats-title"
        >
          {countriesJson["world"].flag} {countriesJson["world"].names[lang]} -{" "}
          {TEXT_TRANSLATION["stats"][lang]} 📊
        </h1>
        <p className="text-sm text-muted-foreground">
          Start with the interactive globe, then switch to the political map or
          table when you need more detail.
        </p>
      </div>

      <Tabs defaultValue="map-3d" className="space-y-5">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 rounded-2xl border border-border/70 bg-card/80 p-1.5 shadow-sm shadow-primary/5 backdrop-blur sm:grid-cols-3">
          {viewTabs.map(({ tab, label, description, Icon }) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="group flex h-full cursor-pointer select-none items-center justify-start gap-3 rounded-xl border border-transparent px-4 py-3 text-left shadow-none transition-all hover:border-primary/20 hover:bg-primary/5 data-[state=active]:border-primary/25 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <span className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-data-[state=active]:bg-primary group-data-[state=active]:text-primary-foreground">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">{label}</span>
                <span className="truncate text-xs font-normal text-muted-foreground group-data-[state=active]:text-primary/80">
                  {description}
                </span>
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="map-3d" className="flex justify-center">
          <div className="w-full">
            <GlobeMap3D data={data} lang={lang} legendCounts={legendCounts} />
          </div>
        </TabsContent>
        <TabsContent value="map-2d" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <WorldPoliticalMap
              data={data}
              lang={lang}
              legendCounts={legendCounts}
            />
          </div>
        </TabsContent>
        <TabsContent value="table" className="flex justify-center">
          <DataTable
            columns={columns}
            data={rows}
            legendCounts={legendCounts}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
