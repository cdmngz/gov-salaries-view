"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import countriesJson from "@/data/countries.json";
import { TEXT_TRANSLATION } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { components } from "@/types/openapi";
import { parseLang } from "@/validators/lang";
import { DataTable } from "./DataTable";
import { buildRows } from "./buildRows";
import { buildColumns } from "./buildColumns";

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
    () => buildColumns({ currency, lang, year, searchParams }),
    [currency, lang, year, searchParams]
  );

  return (
    <div className="p-4 space-y-8">
      <h1
        className="text-xl text-center font-semibold"
        data-testid="world-stats-title"
      >
        {countriesJson["world"].flag} {countriesJson["world"].names[lang]} -{" "}
        {TEXT_TRANSLATION["stats"][lang]} 📊
      </h1>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
