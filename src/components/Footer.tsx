// src/components/Footer.tsx

"use client";

import { ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { FOOTER_MESSAGE } from "@/i18n";
import { Language, parseLang } from "@/validators/lang";

export default function Footer({ version }: { version: string }) {
  const searchParams = useSearchParams();

  const lang: Language = useMemo(
    () => parseLang(searchParams.get("lang")),
    [searchParams]
  );

  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <footer className="border-t border-border/60 bg-card/80 px-6 py-8 text-center text-xs text-muted-foreground backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[28px] border border-border/60 bg-background/70 p-6 shadow-lg shadow-black/5">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Open civic data, presented with a more modern reading experience.
        </div>

        <p className="text-sm leading-6">
          {before}
          <Link
            href="https://github.com/cdmngz/gov-salaries-data"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the data repository on GitHub"
            className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition hover:text-primary"
          >
            data
          </Link>
          {after}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {version && (
            <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1.5 font-medium">
              Release {version}
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 font-medium">
            <ShieldCheck className="size-3.5" />
            © {new Date().getFullYear()} OfficialSalaries.org
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/docs/privacy-policy"
            className="underline decoration-border underline-offset-4 transition hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/docs/terms-of-use"
            className="underline decoration-border underline-offset-4 transition hover:text-foreground"
          >
            Terms of Use
          </Link>
          <Link
            href="/docs/data-sources"
            className="underline decoration-border underline-offset-4 transition hover:text-foreground"
          >
            Data Sources & Attribution
          </Link>
        </div>
      </div>
    </footer>
  );
}
