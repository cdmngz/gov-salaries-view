import type { Metadata } from "next";

import { buildStaticMetadata } from "@/lib/metadata";

const DESCRIPTION =
  "OfficialSalaries.org operates without cookies or trackers and keeps user interactions anonymous.";

export const metadata: Metadata = buildStaticMetadata({
  path: "/docs/privacy-policy",
  title: "Privacy Policy",
  description: DESCRIPTION,
  keywords: [
    "privacy-focused salary database",
    "no tracking policy",
    "public data privacy",
  ],
});

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed">
      <header className="mb-6">
        <h1 className="text-2xl font-light">Privacy Policy</h1>
        <p className="mt-3 text-base text-gray-700">{DESCRIPTION}</p>
      </header>

      <section aria-labelledby="collection" className="space-y-3">
        <h2 id="collection" className="text-lg font-light">
          Data collection practices
        </h2>
        <p>
          We do not collect names, email addresses, IP logs, or browsing
          fingerprints. The platform serves static content and does not embed
          third-party analytics, ad pixels, or cookies. Server logs are limited
          to aggregated operational metrics that help keep the site available.
        </p>
      </section>

      <section aria-labelledby="sources" className="mt-8 space-y-3">
        <h2 id="sources" className="text-lg font-light">
          Source material
        </h2>
        <p>
          All salary information is imported from publicly available government
          datasets. No user-generated submissions are accepted, and there is no
          mechanism for uploading personal information. This ensures compliance
          with global privacy regulations and keeps the scope of processing
          limited to public records.
        </p>
      </section>

      <section aria-labelledby="contact" className="mt-8 space-y-3">
        <h2 id="contact" className="text-lg font-light">
          Contact & updates
        </h2>
        <p>
          Please open an issue on GitHub if you notice a privacy concern or
          believe additional disclosures are necessary. We review the policy
          annually and whenever infrastructure changes could impact visitor
          data.
        </p>
        <p className="text-sm text-gray-500">Last updated: August 2025</p>
      </section>
    </main>
  );
}
