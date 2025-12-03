// src/app/world/[year]/DataTable.tsx

"use client";

import { useEffect, useState } from "react";
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageSizeChoice, setPageSizeChoice] = useState<number | "all">(25);

  const table = useReactTable({
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
      pagination: { pageSize: 25 },
      sorting: [{ id: "total", desc: true }],
    },
  });

  const filteredLen = table.getFilteredRowModel().rows.length;

  useEffect(() => {
    const size = pageSizeChoice === "all" ? filteredLen : pageSizeChoice;
    table.setPageSize(size || 1);
    table.setPageIndex(0);
  }, [pageSizeChoice, filteredLen, table]);

  return (
    <div className="space-y-2 bg-card p-8 overflow-auto">
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

        <div className="flex w-full flex-wrap justify-end items-center gap-4">
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
      <RangeLegend counts={legendCounts} className="justify-end" />

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

      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1} • {filteredLen} rows
        </div>

        <div className="flex items-center gap-3">
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
