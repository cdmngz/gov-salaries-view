// src/components/SearchableCombobox.tsx

"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type SearchConfig = {
  placeholder?: string;
  emptyMessage?: string;
};

export type Option = {
  value: string;
  label: React.ReactNode;
  searchText: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Option[];
  searchConfig?: SearchConfig;
};

export default function SearchableCombobox({
  value,
  onChange,
  placeholder,
  options,
  searchConfig,
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-full min-w-0 justify-between gap-2 rounded-full border-0 bg-transparent px-3 text-sm shadow-none hover:bg-transparent"
        >
          {selected ? (
            <span className="min-w-0 flex-1 truncate text-left">
              {selected.label}
            </span>
          ) : (
            <span className="min-w-0 flex-1 truncate text-left text-muted-foreground">
              {placeholder}
            </span>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[240px] rounded-2xl border-border/70 p-0 max-h-96 overflow-y-auto shadow-xl">
        <Command>
          <CommandInput placeholder={searchConfig?.placeholder ?? "Search"} />
          <CommandEmpty>
            {searchConfig?.emptyMessage ?? "No results"}
          </CommandEmpty>
          <CommandGroup>
            {options.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.searchText}
                onSelect={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    opt.value === value ? "opacity-100" : "opacity-0"
                  )}
                />
                {opt.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
