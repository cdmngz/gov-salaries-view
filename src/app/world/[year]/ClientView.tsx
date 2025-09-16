// src/app/world/[year]/ClientView.tsx

"use client";

import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import countriesJson from "@/data/countries.json";
import { TEXT_TRANSLATION } from "@/i18n";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { cn, convert, formatCurrency } from "@/lib/utils";
import { CountryCode } from "@/types";
import { components } from "@/types/openapi";
import { parseLang } from "@/validators/lang";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Row = {
  code: CountryCode;
  executiveRange?: number[];
  restRange?: number[];
  ministersQty: number;
  budget: number;
  gdp: number;
  gdpPerCapita: number;
  gdpPercent: number;
  deputiesQty: number;
  senateQty: number;
  countryName: string;
  total: number;
  minAnnualSalary: number;
};

const rangeColorByValue: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-red-200",
  3: "bg-gray-300",
  4: "bg-blue-200",
  5: "bg-blue-400",
};

function RangeDots({ ranges }: { ranges?: number[] }) {
  if (!ranges?.length) return null;
  return (
    <div className="flex items-center gap-1">
      {ranges.map((r, i) => (
        <div
          key={`${i}-${r}`}
          className={cn(
            "size-3 rounded-full",
            rangeColorByValue[r] ?? "bg-gray-300"
          )}
          aria-label={`range-${r}`}
          title={`range ${r}`}
        />
      ))}
    </div>
  );
}

function RangeLegend() {
  const items: Array<[number, string]> = [
    [1, "Left"],
    [3, "Center"],
    [5, "Right"],
  ];
  return (
    <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
      {items.map(([val, label]) => (
        <div key={val} className="flex items-center gap-1">
          <div className={cn("size-3 rounded-full", rangeColorByValue[val])} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function DataTable({
  columns,
  data,
}: {
  columns: ColumnDef<Row>[];
  data: Row[];
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 25 },
      sorting: [{ id: "total", desc: true }],
    },
  });

  return (
    <div className="space-y-2 bg-card p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Input
          className="w-full sm:max-w-xs"
          placeholder="Filter countries"
          value={
            (table.getColumn("countryName")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) =>
            table.getColumn("countryName")?.setFilterValue(e.target.value)
          }
          aria-label="Filter countries"
        />

        <div className="ml-auto flex items-center gap-3">
          <RangeLegend />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-none bg-card shadow-none"
              >
                Columns <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllLeafColumns()
                .filter((col) => col.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {String(column.columnDef.header ?? column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Pagination controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-none rounded-none"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-none rounded-none"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={
                          header.column.getCanSort()
                            ? `Sort by ${String(
                                header.column.columnDef.header
                              )}`
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? " ↑" : ""}
                        {header.column.getIsSorted() === "desc" ? " ↓" : ""}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount() || 1} • {table.getFilteredRowModel().rows.length}{" "}
        rows
      </div>
    </div>
  );
}

export default function ClientView({
  data,
  rates,
}: {
  data: components["schemas"]["WorldData"];
  rates: components["schemas"]["Rates"];
}) {
  const searchParams = useSearchParams();
  const currency = (
    (searchParams.get("currency") ?? DEFAULT_CURRENCY) as string
  ).toUpperCase();
  const lang = parseLang(searchParams.get("lang"));

  const rows: Row[] = useMemo(() => {
    return Object.entries(data).map(([code, stats]) => {
      const executiveRange =
        stats.partyRangeStatsSplit?.executive?.mostPopularRanges ?? [];
      const restRange =
        stats.partyRangeStatsSplit?.rest?.mostPopularRanges ?? [];

      const minAnnualSalary = convert(
        stats.minAnnualSalary,
        DEFAULT_CURRENCY,
        currency,
        rates.rates
      );
      const gdp = convert(stats.GDP, DEFAULT_CURRENCY, currency, rates.rates);
      const gdpPerCapita = convert(
        stats.GDPPerCapita,
        DEFAULT_CURRENCY,
        currency,
        rates.rates
      );
      const budget = convert(
        stats.ministers.budget,
        DEFAULT_CURRENCY,
        currency,
        rates.rates
      );
      const gdpPercent = gdp ? (budget * 100) / gdp : 0;
      const ministersQty = stats.ministers.quantity;
      const deputiesQty = stats.deputies.quantity;
      const senateQty = stats.senate.quantity;

      return {
        code: code as CountryCode,
        executiveRange,
        restRange,
        ministersQty,
        budget,
        minAnnualSalary,
        gdp,
        gdpPerCapita,
        gdpPercent,
        deputiesQty,
        senateQty,
        countryName: `${
          countriesJson[code as CountryCode].names[lang]
        } ${code}`,
        total: ministersQty + deputiesQty + senateQty,
      };
    });
  }, [data, currency, rates, lang]);

  const columns: ColumnDef<Row>[] = useMemo(() => {
    return [
      {
        accessorKey: "countryName",
        header: "Country",
        enableHiding: false,
        cell: ({ row }) => {
          const code = row.original.code;
          const info = countriesJson[code];
          return (
            <div className="flex items-center gap-2">
              <span className="text-lg leading-none" aria-hidden>
                {info.flag}
              </span>
              <span>{info.names[lang]}</span>
              <span className="text-muted-foreground text-xs">({code})</span>
            </div>
          );
        },
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "executiveRange",
        header: "Wing (Exec)",
        enableSorting: false,
        cell: ({ row }) => <RangeDots ranges={row.original.executiveRange} />,
      },
      {
        accessorKey: "restRange",
        header: "Wing (Rest)",
        enableSorting: false,
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
      // {
      //   accessorKey: "gdpPercent",
      //   header: "% of GDP (budget)",
      //   cell: ({ getValue }) => (
      //     <span className="tabular-nums">
      //       {getValue<number>().toFixed(2)}%
      //     </span>
      //   ),
      // },
    ];
  }, [currency, lang]);

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl text-center font-semibold">
        {countriesJson["world"].flag} {countriesJson["world"].names[lang]}
        {" - "}
        {TEXT_TRANSLATION["stats"][lang]} 📊
      </h1>
      <DataTable columns={columns} data={rows} />
    </div>
  );
}
