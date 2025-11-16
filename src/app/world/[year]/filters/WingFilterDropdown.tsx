// src/app/world/[year]/filters/WingFilterDropdown.tsx

"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  rangeColorByValue,
  WING_FILTER_VALUE_TO_RANGE,
  type WingFilterSelection,
  type WingFilterValue,
  type Row,
} from "@/app/world/[year]/table/types";
import type { Column } from "@tanstack/react-table";

interface WingFilterDropdownProps {
  column: Column<Row, unknown> | undefined;
  columnLabel: string;
}

export function WingFilterDropdown({
  column,
  columnLabel,
}: WingFilterDropdownProps) {
  const selection: WingFilterSelection =
    (column?.getFilterValue() as WingFilterSelection | undefined) ?? [];

  const isFiltering = selection.length > 0;

  const toggleValue = (value: WingFilterValue) => {
    if (!column) return;
    const next = new Set(selection);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    const arr = Array.from(next);
    column.setFilterValue(arr.length ? arr : undefined);
  };

  const clearAll = () => column?.setFilterValue(undefined);

  const Indicator = () => {
    if (!isFiltering)
      return (
        <div
          className="size-2.5 rounded-full border border-border bg-muted-foreground/40"
          aria-hidden
        />
      );
    const colors = selection.map(
      (v) => rangeColorByValue[WING_FILTER_VALUE_TO_RANGE[v]]
    );
    return (
      <div className="flex items-center gap-0.5" aria-hidden>
        {colors.map((c, i) => (
          <div
            key={`${c}-${i}`}
            className={cn("size-2.5 rounded-full border border-border", c)}
          />
        ))}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-card px-3 py-2 text-left shadow-none "
        >
          <span className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-wide">
            <Indicator />
            {columnLabel}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Political alignment
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.keys(WING_FILTER_VALUE_TO_RANGE).map((key) => {
          const value = key as WingFilterValue;
          const colorClass =
            rangeColorByValue[WING_FILTER_VALUE_TO_RANGE[value]];
          const checked = selection.includes(value);

          return (
            <DropdownMenuCheckboxItem
              key={value}
              checked={checked}
              onCheckedChange={() => toggleValue(value)}
              data-testid={`wing-filter-option-${value}`}
            >
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span
                    className={cn(
                      "size-2.5 rounded-full border border-border",
                      colorClass ?? "bg-muted-foreground/40"
                    )}
                    aria-hidden
                  />
                  {value}
                </span>
              </div>
            </DropdownMenuCheckboxItem>
          );
        })}
        {isFiltering ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={clearAll}
              className="text-xs text-muted-foreground"
            >
              Clear filter
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
