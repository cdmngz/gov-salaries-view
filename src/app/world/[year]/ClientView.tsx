"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { Globe2, MapPinned, Table2 } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
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

  const selectedView = ["map-3d", "map-2d", "table"].includes(
    searchParams.get("view") ?? ""
  )
    ? searchParams.get("view")!
    : "map-3d";

  const openCountry = ({ iso_a2 }: { iso_a2?: string }) => {
    if (!iso_a2) return;

    const query = searchParams.toString();
    router.push(
      `/${iso_a2.toLowerCase()}/${year}${query ? `?${query}` : ""}`
    );
  };

  const viewTabs = [
    {
      tab: "map-3d",
      label: "Globe",
      Icon: Globe2,
    },
    {
      tab: "map-2d",
      label: "Map",
      Icon: MapPinned,
    },
    {
      tab: "table",
      label: "Table",
      Icon: Table2,
    },
  ];

  const selectView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === "map-3d") params.delete("view");
    else params.set("view", view);

    const query = params.toString();
    router.replace(`${window.location.pathname}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  };

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
      </div>

      <Tabs value={selectedView} onValueChange={selectView} className="space-y-5">
        <TabsList
          className="mx-auto grid h-10 w-full max-w-sm grid-cols-3 rounded-full bg-muted/60 p-1"
          aria-label="Choose a data view"
        >
          {viewTabs.map(({ tab, label, Icon }) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="flex cursor-pointer select-none items-center justify-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="map-3d" className="flex justify-center">
          <div className="w-full">
            <GlobeMap3D
              data={data}
              lang={lang}
              legendCounts={legendCounts}
              onCountryClick={openCountry}
            />
          </div>
        </TabsContent>
        <TabsContent value="map-2d" className="flex justify-center">
          <div className="w-full max-w-5xl">
            <WorldPoliticalMap
              data={data}
              lang={lang}
              legendCounts={legendCounts}
              onCountryClick={openCountry}
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
