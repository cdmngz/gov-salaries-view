// src/components/DatasetStructuredData.tsx

import { catalogPublisher, socialImageUrl } from "@/lib/metadata";
import { SUPPORTED_LANGUAGES } from "@/lib/seo";

type Distribution = {
  name: string;
  contentUrl: string;
  encodingFormat?: string;
};

type DatasetStructuredDataProps = {
  datasetName: string;
  description: string;
  url: string;
  keywords: string[];
  temporalCoverage: string;
  spatialCoverageName?: string;
  distributions: Distribution[];
};

export default function DatasetStructuredData({
  datasetName,
  description,
  url,
  keywords,
  temporalCoverage,
  spatialCoverageName,
  distributions,
}: DatasetStructuredDataProps) {
  const baseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: datasetName,
    description,
    url,
    keywords,
    inLanguage: SUPPORTED_LANGUAGES,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    image: socialImageUrl,
    creator: catalogPublisher,
    publisher: catalogPublisher,
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: catalogPublisher.name,
      url: catalogPublisher.url,
    },
    temporalCoverage,
    distribution: distributions.map((distribution) => ({
      "@type": "DataDownload",
      name: distribution.name,
      contentUrl: distribution.contentUrl,
      encodingFormat: distribution.encodingFormat ?? "application/json",
    })),
  } as const;

  const structuredData = spatialCoverageName
    ? {
        ...baseJsonLd,
        spatialCoverage: {
          "@type": "Place",
          name: spatialCoverageName,
        },
      }
    : baseJsonLd;

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
