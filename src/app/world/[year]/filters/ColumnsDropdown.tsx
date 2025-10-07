"use client";

import { ChevronDown } from "lucide-react";

import { Row } from "@/app/world/[year]/table/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Table } from "@tanstack/react-table";

export function ColumnsDropdown({ table }: { table: Table<Row> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild data-testid="columns-dropdown-trigger">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-none bg-card px-3 py-2 shadow-none"
        >
          <span
            className="flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-wide"
            data-testid="columns-dropdown-label"
          >
            Columns
          </span>
          <ChevronDown
            className="h-4 w-4 opacity-60"
            aria-hidden
            data-testid="columns-dropdown-icon"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
        data-testid="columns-dropdown-content"
      >
        <DropdownMenuLabel
          className="text-xs text-muted-foreground"
          data-testid="columns-dropdown-header"
        >
          Toggle columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator data-testid="columns-dropdown-separator" />

        {table
          .getAllLeafColumns()
          .filter((col) => col.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              data-testid={`column-toggle-${column.id}`}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={(v) => column.toggleVisibility(!!v)}
            >
              {String(column.columnDef.header ?? column.id)}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
