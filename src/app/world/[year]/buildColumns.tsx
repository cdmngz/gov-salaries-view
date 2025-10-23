// src/app/world/[year]/buildColumns.tsx
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { RangeDots } from "./parts/RangeDots";
import type { Row } from "./table/types";
import { wingRangeFilter } from "./filters/wingRangeFilter";

export function buildColumns(args: {
  currency: string;
  year: string;
  searchParams: URLSearchParams;
}): ColumnDef<Row>[] {
  const { currency, year, searchParams } = args;

  return [
    {
      accessorKey: "countryName",
      header: "Country",
      enableHiding: false,
      cell: ({ row }) => {
        const code = row.original.code;
        const { codeLabel, displayName, flag, hasCountryPage } = row.original;
        const qs = searchParams.toString();
        const href = `/${code}/${year}${qs ? `?${qs}` : ""}`;
        const content = (
          <>
            {flag ? (
              <span className="text-lg leading-none" aria-hidden>
                {flag}
              </span>
            ) : null}
            <span>{displayName}</span>
            <span className="text-muted-foreground text-xs">({codeLabel})</span>
          </>
        );

        if (!hasCountryPage) {
          return (
            <div
              className="flex items-center gap-2"
              aria-label={`${displayName} (${codeLabel})`}
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            href={href}
            className="flex items-center gap-2"
            aria-label={`Go to ${displayName} page`}
          >
            {content}
          </Link>
        );
      },
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "executiveRange",
      header: "Executive",
      filterFn: wingRangeFilter,
      cell: ({ row }) => <RangeDots ranges={row.original.executiveRange} />,
    },
    {
      accessorKey: "restRange",
      header: "Officials",
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
