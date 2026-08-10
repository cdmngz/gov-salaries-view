// src/app/world/[year]/DataTable.tsx

"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type SortingState,
} from "@tanstack/react-table";
import {
  type LegacyColumnDef as ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useLegacyTable,
} from "@tanstack/react-table/legacy";
import { cn } from "@/lib/utils";
import { RangeLegend, type LegendCounts } from "./parts/RangeLegend";
import { WingFilterDropdown } from "./filters/WingFilterDropdown";
import { ColumnsDropdown } from "./filters/ColumnsDropdown";
import { wingRangeFilter } from "./filters/wingRangeFilter";
import type { Row } from "./table/types";

export function DataTable({
  columns,
  data,
  legendCounts,
}: {
  columns: ColumnDef<Row>[];
  data: Row[];
  legendCounts?: LegendCounts;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [pageSizeChoice, setPageSizeChoice] = useState<number | "all">(25);

  const table = useLegacyTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    filterFns: { wingRange: wingRangeFilter },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageIndex: 0, pageSize: 25 },
      sorting: [{ id: "total", desc: true }],
    },
  });

  const filteredLen = table.getFilteredRowModel().rows.length;
  const countryFilter =
    (table.getColumn("countryName")?.getFilterValue() as string) ?? "";

  useEffect(() => {
    const size = pageSizeChoice === "all" ? filteredLen : pageSizeChoice;
    table.setPageSize(size || 1);
    table.setPageIndex(0);
  }, [pageSizeChoice, filteredLen, table]);

  return (
    <div className="space-y-3 overflow-x-auto rounded-xl bg-card p-3 sm:p-6 lg:p-8">
      <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="w-full pl-9 pr-9"
            placeholder="Filter countries"
            value={countryFilter}
            onChange={(e) =>
              table.getColumn("countryName")?.setFilterValue(e.target.value)
            }
            aria-label="Filter countries"
          />
          {countryFilter && (
            <button
              type="button"
              onClick={() =>
                table.getColumn("countryName")?.setFilterValue("")
              }
              className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              aria-label="Clear country filter"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 lg:justify-end">
          <div className="flex flex-wrap gap-4">
            {(["executiveRange", "restRange"] as const).map((columnId) => (
              <WingFilterDropdown
                key={columnId}
                column={table.getColumn(columnId)}
                columnLabel={
                  columnId === "executiveRange" ? "Wing (Exec)" : "Wing (Rest)"
                }
              />
            ))}
          </div>
          <ColumnsDropdown table={table} />
        </div>
      </div>
      <RangeLegend counts={legendCounts} className="justify-start lg:justify-end" />

      <div className="rounded-md border">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
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
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1} • {filteredLen}{" "}
          {filteredLen === 1 ? "row" : "rows"}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label htmlFor="rows-per-page" className="text-xs">
            Rows per page
          </label>
          <select
            id="rows-per-page"
            className="h-8  border-none bg-background px-2 text-sm"
            value={String(pageSizeChoice)}
            onChange={(e) =>
              setPageSizeChoice(
                e.target.value === "all" ? "all" : Number(e.target.value)
              )
            }
            aria-label="Rows per page"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="all">All</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            className="border-none "
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-none "
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
