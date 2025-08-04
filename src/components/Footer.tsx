// /src/components/Footer.tsx

"use client";

import { FOOTER_MESSAGE } from "@/i18n";
import { Language } from "@/validators/lang";
import Link from "next/link";

type FooterProps = {
  lang: Language;
};

export default function Footer({ lang }: FooterProps) {
  const message = FOOTER_MESSAGE[lang];
  const [before = "", after = ""] = message.split("{{data}}");

  return (
    <footer className="py-4 text-center text-sm text-gray-600 dark:text-gray-300">
      {before}
      <Link
        href="https://github.com/cdmngz/gov-salaries-data"
        target="_blank"
        className="text-blue-600 underline"
      >
        data
      </Link>
      {after}
    </footer>
  );
}
