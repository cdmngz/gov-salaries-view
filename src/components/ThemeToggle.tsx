// src/components/ThemeToggle.tsx

"use client";

import { Check, LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-full border-0 bg-muted/55 shadow-none transition hover:bg-muted/80"
        disabled
      >
        <SunIcon className="size-4" />
      </Button>
    );
  }

  const icon =
    resolvedTheme === "dark" ? (
      <MoonIcon className="size-4" />
    ) : (
      <SunIcon className="size-4" />
    );

  const Item = ({
    value,
    label,
    icon,
  }: {
    value: string;
    label: string;
    icon: React.ReactNode;
  }) => (
    <DropdownMenuItem
      onClick={() => setTheme(value)}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
      {theme === value && <Check className="size-4 opacity-70" />}
    </DropdownMenuItem>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-0 bg-muted/55 shadow-none transition hover:bg-muted/80"
          aria-label="Toggle theme"
        >
          {icon}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Item
          value="light"
          label="Light"
          icon={<SunIcon className="size-4" />}
        />
        <Item
          value="dark"
          label="Dark"
          icon={<MoonIcon className="size-4" />}
        />
        <Item
          value="system"
          label="System"
          icon={<LaptopIcon className="size-4" />}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
