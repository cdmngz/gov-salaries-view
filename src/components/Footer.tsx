"use client";

import { FOOTER_MESSAGE } from "@/i18n";
import { Language } from "@/validators/lang";
import Link from "next/link";

type FooterProps = {
  lang: Language;
  version?: string;
};

export default function Footer({ lang, version }: FooterProps) {
  const [before = "", after = ""] = FOOTER_MESSAGE[lang].split("data");

  return (
    <footer className="py-6 text-center text-sm text-muted-foreground border-t border-gray-200 dark:border-gray-700 space-y-2">
      <p>
        {before}
        <Link
          href="https://github.com/cdmngz/gov-salaries-data"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View the data repository on GitHub"
          className="underline hover:text-blue-600"
        >
          data
        </Link>
        {after}
      </p>

      {version && (
        <p className="text-xs font-light m-0">Release version {version}</p>
      )}

      <div className="text-xs space-y-1 mt-4">
        <p>
          &copy; {new Date().getFullYear()} OfficialSalaries.org. All rights
          reserved.
        </p>
        <p>
          <Link
            href="/docs/privacy-policy"
            className="underline hover:text-blue-600"
          >
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            href="/docs/terms-of-use"
            className="underline hover:text-blue-600"
          >
            Terms of Use
          </Link>{" "}
          |{" "}
          <Link
            href="/docs/data-sources"
            className="underline hover:text-blue-600"
          >
            Data Sources & Attribution
          </Link>
        </p>
      </div>
    </footer>
  );
}
