import type { Metadata } from "next";

import { buildStaticMetadata } from "@/lib/metadata";

const DESCRIPTION =
  "Guidelines for using, remixing, and attributing the salary transparency data on OfficialSalaries.org.";

export const metadata: Metadata = buildStaticMetadata({
  path: "/docs/terms-of-use",
  title: "Terms of Use",
  description: DESCRIPTION,
  keywords: [
    "salary data terms",
    "open data reuse",
    "government salary license",
  ],
});

export default function TermsOfUsePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <header className="mb-6">
        <h1 className="text-2xl font-light">Terms of Use</h1>
        <p className="mt-3 text-base text-gray-700">{DESCRIPTION}</p>
      </header>

      <section aria-labelledby="scope" className="space-y-3">
        <h2 id="scope" className="text-lg font-light">
          Scope of permitted use
        </h2>
        <p>
          OfficialSalaries.org is designed for journalism, research, civic
          oversight, and educational projects. You may download and analyze the
          data for lawful purposes, provided that you credit the site and any
          government publishers referenced on the relevant dataset page.
        </p>
      </section>

      <section aria-labelledby="accuracy" className="mt-8 space-y-3">
        <h2 id="accuracy" className="text-lg font-light">
          Accuracy & liability
        </h2>
        <p>
          While we strive to reflect official records, there may be delays or
          corrections issued by the originating agency. Use the information at
          your own risk, and confirm figures with the source portal before
          making financial or employment decisions. We are not liable for
          damages that arise from reliance on the dataset.
        </p>
      </section>

      <section aria-labelledby="derivatives" className="mt-8 space-y-3">
        <h2 id="derivatives" className="text-lg font-light">
          Derivative works & attribution
        </h2>
        <p>
          You are encouraged to create derivative analyses, but you must
          maintain attribution and keep public data open whenever possible. If
          you fork or mirror the repository, include a link back to
          OfficialSalaries.org so search engines understand the provenance of
          the material.
        </p>
        <p className="text-sm text-gray-500">Last updated: August 2025</p>
      </section>
    </main>
  );
}
