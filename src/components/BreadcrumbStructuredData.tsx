// src/components/BreadcrumbStructuredData.tsx

type BreadcrumbItem = {
  name: string;
  url: string;
};

function buildJsonLd(items: BreadcrumbItem[]) {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  });
}

export default function BreadcrumbStructuredData({
  items,
}: {
  items: BreadcrumbItem[];
}) {
  const jsonLd = buildJsonLd(items);

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}
