// src/components/SeoStructuredData.tsx

import { serverEnv } from "@/lib/env";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SUPPORTED_LANGUAGES,
} from "@/lib/seo";

function buildStructuredData() {
  const baseUrl = serverEnv.WEB_URL.replace(/\/+$/, "");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["WebSite", "DataCatalog"],
    name: SITE_NAME,
    url: baseUrl,
    description: SITE_DESCRIPTION,
    inLanguage: SUPPORTED_LANGUAGES,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "OfficialSalaries.org",
      url: baseUrl,
    },
    creator: {
      "@type": "Organization",
      name: "OfficialSalaries.org",
      url: baseUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/world/{search_term_string}`,
      query: "required",
      "query-input": "required name=search_term_string",
    },
  } as const;

  return JSON.stringify(structuredData);
}

export default function SeoStructuredData() {
  const jsonLd = buildStructuredData();

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
