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
          className="w-[200px] justify-between bg-card border-none shadow-none text-sm"
        >
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0 max-h-96 overflow-y-auto">
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
