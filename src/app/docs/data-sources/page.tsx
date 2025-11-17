// src/app/docs/data-sources/page.tsx

import type { Metadata } from "next";

import { buildStaticMetadata } from "@/lib/metadata";

const DESCRIPTION =
  "Attribution and documentation for public salary datasets powering OfficialSalaries.org.";

export const metadata: Metadata = buildStaticMetadata({
  path: "/docs/data-sources",
  title: "Data Sources & Attribution",
  description: DESCRIPTION,
  keywords: [
    "salary data sources",
    "public records attribution",
    "government salary datasets",
  ],
});

export default function DataSourcesPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <header className="mb-6">
        <h1 className="text-2xl font-light">Data Sources & Attribution</h1>
        <p className="mt-3 text-base text-gray-700">{DESCRIPTION}</p>
      </header>

      <section aria-labelledby="catalog" className="space-y-3">
        <h2 id="catalog" className="text-lg font-light">
          Central data catalog
        </h2>
        <p>
          Salaries, titles, agencies, and employment metadata are synchronized
          from the open-source repository below. The repository keeps revision
          history for every import so reporters can cite the precise commit used
          in an investigation.
        </p>
        <p>
          <strong>GitHub Repository</strong>:{" "}
          <a
            href="https://github.com/cdmngz/gov-salaries-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            cdmngz/gov-salaries-data
          </a>
        </p>
      </section>

      <section aria-labelledby="attribution" className="mt-8 space-y-3">
        <h2 id="attribution" className="text-lg font-light">
          Attribution guidance
        </h2>
        <p>
          Please reference both OfficialSalaries.org and the originating
          government portal when republishing tables or insights. Many source
          agencies publish under Creative Commons or open government licenses
          that require attribution and link-back language.
        </p>
        <p>
          When in doubt, cite the specific jurisdictional portal listed inside
          the repository README and include a link to the commit hash you used
          to build your story or analysis. This approach provides a verifiable
          audit trail and improves search visibility for the original data
          stewards.
        </p>
      </section>

      <section aria-labelledby="updates" className="mt-8 space-y-3">
        <h2 id="updates" className="text-lg font-light">
          Update cadence
        </h2>
        <p>
          We continually add new jurisdictions and refresh exchange-rate data to
          keep annual compensation figures comparable. Subscribe to repository
          releases or watch the project on GitHub to be notified when new salary
          batches land.
        </p>
        <p className="text-sm text-gray-500">Last updated: August 2025</p>
      </section>
    </main>
  );
}
