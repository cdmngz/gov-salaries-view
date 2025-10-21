"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import countriesJson from "@/data/countries.json";
import { TEXT_TRANSLATION } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { components } from "@/types/openapi";
import { parseLang } from "@/validators/lang";
import { DataTable } from "./DataTable";
import { buildRows } from "./buildRows";
import { buildColumns } from "./buildColumns";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const WorldPoliticalMap = dynamic(() => import("./WorldPoliticalMap"), {
  ssr: false,
});
const GlobeMap3D = dynamic(() => import("./GlobeMap3D"), { ssr: false });

export default function ClientView({
  data,
  rates,
}: {
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["Rates"];
}) {
  const searchParams = useSearchParams();
  const { year } = useParams<{ year: string }>();
  const currency = (
    (searchParams.get("currency") ?? DEFAULT_CURRENCY) as string
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

  const [open, setOpen] = useState<string | undefined>(undefined);

  return (
    <div className="p-4 space-y-8">
      <h1
        className="text-xl text-center font-semibold"
        data-testid="world-stats-title"
      >
        {countriesJson["world"].flag} {countriesJson["world"].names[lang]} -{" "}
        {TEXT_TRANSLATION["stats"][lang]} 📊
      </h1>

      <Accordion
        type="single"
        collapsible
        value={open}
        onValueChange={(v) => setOpen(v || undefined)}
      >
        <AccordionItem value="maps" className="p-2">
          <AccordionTrigger className="cursor-pointer">
            World maps
          </AccordionTrigger>
          <AccordionContent>
            {open === "maps" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <WorldPoliticalMap data={data} lang={lang} />
                <GlobeMap3D data={data} lang={lang} />
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DataTable columns={columns} data={rows} />
    </div>
  );
}
