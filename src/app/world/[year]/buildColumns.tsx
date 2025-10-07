// src/app/world/[year]/buildColumns.tsx
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import countriesJson from "@/data/countries.json";
import { formatCurrency } from "@/lib/utils";
import { RangeDots } from "./parts/RangeDots";
import type { Row } from "./table/types";
import { wingRangeFilter } from "./filters/wingRangeFilter";
import type { Language } from "@/validators/lang";

export function buildColumns(args: {
  currency: string;
  lang: Language;
  year: string;
  searchParams: URLSearchParams;
}): ColumnDef<Row>[] {
  const { currency, lang, year, searchParams } = args;

  return [
    {
      accessorKey: "countryName",
      header: "Country",
      enableHiding: false,
      cell: ({ row }) => {
        const code = row.original.code;
        const info = countriesJson[code];
        const qs = searchParams.toString();
        const href = `/${code}/${year}${qs ? `?${qs}` : ""}`;
        return (
          <Link
            href={href}
            className="flex items-center gap-2"
            aria-label={`Go to ${info.names[lang]} page`}
          >
            <span className="text-lg leading-none" aria-hidden>
              {info.flag}
            </span>
            <span>{info.names[lang]}</span>
            <span className="text-muted-foreground text-xs">({code})</span>
          </Link>
        );
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "executiveRange",
      header: "Wing (Exec)",
      enableSorting: false,
      filterFn: wingRangeFilter,
      cell: ({ row }) => <RangeDots ranges={row.original.executiveRange} />,
    },
    {
      accessorKey: "restRange",
      header: "Wing (Rest)",
      enableSorting: false,
      filterFn: wingRangeFilter,
      cell: ({ row }) => <RangeDots ranges={row.original.restRange} />,
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "ministersQty",
      header: "Ministries",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "deputiesQty",
      header: "Deputies",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "senateQty",
      header: "Senate",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue<number>()}</span>
      ),
    },
    {
      accessorKey: "minAnnualSalary",
      header: "Annual min salary",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatCurrency(getValue<number>(), currency)}
        </span>
      ),
    },
    {
      accessorKey: "gdp",
      header: "GDP",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatCurrency(getValue<number>(), currency)}
        </span>
      ),
    },
    {
      accessorKey: "gdpPerCapita",
      header: "GDP per Capita",
      cell: ({ getValue }) => (
        <span className="tabular-nums">
          {formatCurrency(getValue<number>(), currency)}
        </span>
      ),
    },
  ];
}
