// src/components/ServerFooter.tsx

import Link from "next/link";
import { FOOTER_MESSAGE } from "@/i18n";
import { DEFAULT_LANG } from "@/lib/constants";
import { publicEnv } from "@/lib/env";
import { Language } from "@/validators/lang";

type Props = {
  lang?: Language;
  version?: string;
};

export default function ServerFooter({ lang = DEFAULT_LANG, version }: Props) {
  const [before = "", after = ""] = (
    FOOTER_MESSAGE[lang] ?? FOOTER_MESSAGE[DEFAULT_LANG]
  ).split("data");
  const release = version ?? publicEnv.NEXT_PUBLIC_GIT_VERSION;

  return (
    <footer className="py-6 border-t border-gray-200 dark:border-gray-800 bg-gray-300 dark:bg-gray-950/40">
      <div className="mx-auto max-w-screen-2xl px-4 text-center text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          {before}
          <Link
            href="https://github.com/cdmngz/gov-salaries-data"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View the data repository on GitHub"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            data
          </Link>
          {after}
        </p>

        {release && (
          <p className="text-xs font-light m-0">Release version {release}</p>
        )}

        <div className="text-xs space-y-1 mt-4">
          <p>
            &copy; {new Date().getFullYear()} OfficialSalaries.org. All rights
            reserved.
          </p>
          <p>
            <Link
              href="/docs/privacy-policy"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link
              href="/docs/terms-of-use"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms of Use
            </Link>{" "}
            |{" "}
            <Link
              href="/docs/data-sources"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Data Sources &amp; Attribution
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
