"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
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

const WorldPoliticalMap = dynamic(() => import("./WorldPoliticalMap"), {
  ssr: false,
});
const GlobeMap3D = dynamic(() => import("./GlobeMap3D"), { ssr: false });

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

  return (
    <div className="space-y-8 p-4">
      <h1
        className="text-xl text-center font-light"
        data-testid="world-stats-title"
      >
        {countriesJson["world"].flag} {countriesJson["world"].names[lang]} -{" "}
        {TEXT_TRANSLATION["stats"][lang]} 📊
      </h1>

      <Tabs defaultValue="map-2d" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-1 gap-2 bg-background p-1 sm:grid-cols-3 sm:gap-3">
          {[
            { tab: "map-2d", label: "World Political Map" },
            { tab: "map-3d", label: "3D World Map" },
            { tab: "table", label: "Stats Table" },
          ].map(({ tab, label }) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="cursor-pointer select-none rounded-md px-3 py-2 text-sm shadow-none data-[state=active]:bg-card data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="map-2d" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <WorldPoliticalMap
              data={data}
              lang={lang}
              legendCounts={legendCounts}
            />
          </div>
        </TabsContent>
        <TabsContent value="map-3d" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <GlobeMap3D data={data} lang={lang} legendCounts={legendCounts} />
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
