import type { Metadata } from "next";
import Link from "next/link";

import { buildStaticMetadata } from "@/lib/metadata";

const DESCRIPTION =
  "Find legal notices, attribution requirements, and transparency resources for OfficialSalaries.org.";

export const metadata: Metadata = buildStaticMetadata({
  path: "/docs",
  title: "Documentation & Legal Resources",
  description: DESCRIPTION,
  keywords: [
    "government salary documentation",
    "public data attribution",
    "salary transparency legal",
  ],
});

export default function DocsIndexPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-wide text-gray-500">Docs</p>
        <h1 className="text-2xl font-light mt-2">
          Documentation & Legal Resources
        </h1>
        <p className="mt-3 text-base text-gray-700">{DESCRIPTION}</p>
      </header>

      <section aria-labelledby="docs-links" className="space-y-4">
        <h2 id="docs-links" className="text-lg font-light">
          Quick links
        </h2>
        <ul className="list-disc list-inside space-y-3">
          <li>
            <Link
              href="/docs/privacy-policy"
              className="text-blue-600 underline"
            >
              Privacy Policy
            </Link>{" "}
            – Learn how we handle browsing data and keep the site cookie-free.
          </li>
          <li>
            <Link href="/docs/terms-of-use" className="text-blue-600 underline">
              Terms of Use
            </Link>{" "}
            – Understand the permitted use cases for the salary datasets and
            derived work.
          </li>
          <li>
            <Link href="/docs/data-sources" className="text-blue-600 underline">
              Data Sources & Attribution
            </Link>{" "}
            – Review the GitHub data catalog and licensing expectations for
            republication.
          </li>
        </ul>
      </section>

      <section aria-labelledby="transparency" className="mt-10 space-y-3">
        <h2 id="transparency" className="text-lg font-light">
          Why document transparency matters
        </h2>
        <p>
          Comprehensive documentation helps journalists, researchers, and civic
          technologists understand how our salary database is assembled. Clear
          attribution and legal guidance increases trust in the dataset and
          enables responsible reuse across investigative projects.
        </p>
        <p>
          Each page in this section is designed as an evergreen reference that
          can be cited in grant reports, newsroom methodology pages, and open
          data inventories. Linking back to these resources signals to search
          engines that OfficialSalaries.org maintains transparent governance
          practices.
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-10 space-y-3">
        <h2 id="contact" className="text-lg font-light">
          Need additional context?
        </h2>
        <p>
          If you have questions about licensing, accessibility, or additional
          metadata that should appear in the documentation, open an issue in the
          <a
            href="https://github.com/cdmngz/gov-salaries-view"
            className="text-blue-600 underline"
            rel="noreferrer noopener"
            target="_blank"
          >
            project repository
          </a>{" "}
          so we can keep this knowledge base comprehensive.
        </p>
      </section>
    </main>
  );
}
