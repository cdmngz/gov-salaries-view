// src/app/world/[year]/ClientView.tsx

"use client";

import { useMemo, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { CountryCode } from "@/types";
import { cn, convert, formatCurrency } from "@/lib/utils";
import countriesJson from "@/data/countries.json";
import { parseLang } from "@/validators/lang";
import { Button } from "@/components/ui/button";
import { TEXT_TRANSLATION } from "@/i18n";
import { components } from "@/types/openapi";

type SortOrder = "asc" | "desc";
type MinistersSortField = "quantity" | "budget" | "gdp" | "percent";

type Row = {
  code: CountryCode;
  ministersQty: number;
  budget: number;
  gdp: number;
  gdpPercent: number;
  deputiesQty: number;
  senateQty: number;
};

export default function ClientView({
  data,
  rates,
}: {
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["Rates"];
}) {
  const searchParams = useSearchParams();
  const currency = (
    searchParams.get("currency") ?? DEFAULT_CURRENCY
  ).toUpperCase();
  const lang = parseLang(searchParams.get("lang"));

  const [ministersField, setMinistersField] =
    useState<MinistersSortField>("quantity");
  const [ministersOrder, setMinistersOrder] = useState<SortOrder>("desc");
  const [deputiesOrder, setDeputiesOrder] = useState<SortOrder>("desc");
  const [senateOrder, setSenateOrder] = useState<SortOrder>("desc");

  const rows: Row[] = useMemo(() => {
    return Object.entries(data).map(([code, stats]) => {
      const gdp = convert(stats.GDP, DEFAULT_CURRENCY, currency, rates.rates);
      const budget = convert(
        stats.ministers.budget,
        DEFAULT_CURRENCY,
        currency,
        rates.rates
      );
      const gdpPercent = gdp ? (budget * 100) / gdp : 0;
      return {
        code: code as CountryCode,
        ministersQty: stats.ministers.quantity,
        budget,
        gdp,
        gdpPercent,
        deputiesQty: stats.deputies.quantity,
        senateQty: stats.senate.quantity,
      };
    });
  }, [data, currency, rates]);

  const sortGeneric = useCallback(
    <T extends { code: string }>(
      arr: T[],
      getVal: (r: T) => number,
      order: SortOrder
    ): T[] => {
      const out = [...arr];
      out.sort((a: T, b: T) => {
        const A = getVal(a);
        const B = getVal(b);
        if (A === B) return a.code.localeCompare(b.code);
        return order === "asc" ? A - B : B - A;
      });
      return out;
    },
    []
  );

  // Ministers sorting
  const ministersRows = useMemo(() => {
    const getter = (r: Row) => {
      switch (ministersField) {
        case "quantity":
          return r.ministersQty;
        case "budget":
          return r.budget;
        case "gdp":
          return r.gdp;
        case "percent":
          return r.gdpPercent;
      }
    };
    return sortGeneric(rows, getter, ministersOrder);
  }, [rows, ministersField, ministersOrder, sortGeneric]);

  // Deputies sorting (quantity only)
  const deputiesRows = useMemo(
    () => sortGeneric(rows, (r: Row) => r.deputiesQty, deputiesOrder),
    [rows, deputiesOrder, sortGeneric]
  );

  // Senate sorting (quantity only)
  const senateRows = useMemo(
    () => sortGeneric(rows, (r: Row) => r.senateQty, senateOrder),
    [rows, senateOrder, sortGeneric]
  );

  const toggleText = (o: SortOrder) => (o === "asc" ? "⬆ Asc" : "⬇ Desc");

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl text-center font-semibold">
        {countriesJson["world"].flag} {countriesJson["world"].names[lang]}
        {" - "}
        {TEXT_TRANSLATION["stats"][lang]} 📊
      </h1>
      {/* Ministers */}
      <section>
        <div className="mb-2 flex items-center flex-wrap gap-2 justify-center">
          <h3 className="font-semibold mr-2">Ministers</h3>

          <div className="flex items-center gap-2">
            <Button
              className={cn("border-none shadow-none rounded-none", {
                "bg-card": ministersField !== "quantity",
              })}
              onClick={() => setMinistersField("quantity")}
              size="sm"
              variant={ministersField === "quantity" ? "default" : "ghost"}
            >
              Number
            </Button>
            <Button
              className={cn("border-none shadow-none rounded-none", {
                "bg-card": ministersField !== "budget",
              })}
              onClick={() => setMinistersField("budget")}
              size="sm"
              variant={ministersField === "budget" ? "default" : "ghost"}
            >
              Budget
            </Button>
            <Button
              className={cn("border-none shadow-none rounded-none", {
                "bg-card": ministersField !== "gdp",
              })}
              onClick={() => setMinistersField("gdp")}
              size="sm"
              variant={ministersField === "gdp" ? "default" : "ghost"}
            >
              GDP
            </Button>
            <Button
              className={cn("border-none shadow-none rounded-none", {
                "bg-card": ministersField !== "percent",
              })}
              onClick={() => setMinistersField("percent")}
              size="sm"
              variant={ministersField === "percent" ? "default" : "ghost"}
            >
              % GDP
            </Button>
          </div>
          <Button
            variant="outline"
            className="bg-card border-none shadow-none rounded-none"
            onClick={() =>
              setMinistersOrder((o) => (o === "asc" ? "desc" : "asc"))
            }
            aria-label="Toggle ministers sort order"
          >
            {toggleText(ministersOrder)}
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4 max-w-10/12 overflow-x-auto">
            {ministersRows.map((r) => (
              <div
                key={`min-${r.code}`}
                className="flex-shrink-0 w-56 p-4 border-none rounded-none shadow-none bg-card"
              >
                <div className="text-base font-semibold">
                  {countriesJson[r.code].flag}{" "}
                  {countriesJson[r.code].names[lang]}
                </div>
                <div className="text-sm">
                  {TEXT_TRANSLATION.ministries[lang]}:{" "}
                  <strong>{r.ministersQty}</strong>
                </div>
                <div className="text-xs text-muted-foreground">
                  {TEXT_TRANSLATION.budget[lang]}:{" "}
                  {formatCurrency(r.budget, currency)}
                </div>
                <br />
                <div className="text-xs text-muted-foreground">
                  {TEXT_TRANSLATION.GDP[lang]}:{" "}
                  {formatCurrency(r.gdp, currency)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.gdpPercent.toFixed(2)}% of GDP
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deputies */}
      <section>
        <div className="mb-2 flex items-center gap-2 justify-center">
          <h3 className="font-semibold mr-2">Deputies</h3>
          <Button
            aria-label="Toggle deputies sort order"
            className="bg-card border-none shadow-none rounded-none"
            onClick={() =>
              setDeputiesOrder((o) => (o === "asc" ? "desc" : "asc"))
            }
            size="sm"
            variant="outline"
          >
            {toggleText(deputiesOrder)}
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4 max-w-10/12 overflow-x-auto">
            {deputiesRows.map((r) => (
              <div
                key={`con-${r.code}`}
                className="flex-shrink-0 w-56 p-4 border-none shadow-none rounded-none bg-card"
              >
                <div className="text-base font-semibold">
                  {countriesJson[r.code].flag}{" "}
                  {countriesJson[r.code].names[lang]}
                </div>
                <div className="text-sm">
                  Members: <strong>{r.deputiesQty}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senate */}
      <section>
        <div className="mb-2 flex items-center gap-2 justify-center">
          <h3 className="font-semibold mr-2">Senate</h3>
          <Button
            aria-label="Toggle senate sort order"
            className="bg-card border-none shadow-none rounded-none"
            onClick={() =>
              setSenateOrder((o) => (o === "asc" ? "desc" : "asc"))
            }
            size="sm"
            variant="outline"
          >
            {toggleText(senateOrder)}
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4 max-w-10/12 overflow-x-auto">
            {senateRows.map((r) => (
              <div
                key={`sen-${r.code}`}
                className="flex-shrink-0 w-56 p-4 border-none shadow-none rounded-none bg-card"
              >
                <div className="text-base font-semibold">
                  {countriesJson[r.code].flag}{" "}
                  {countriesJson[r.code].names[lang]}
                </div>
                <div className="text-sm">
                  Members: <strong>{r.senateQty}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
