// src/app/page.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DEFAULT_CURRENCY, DEFAULT_LANG } from "@/lib/constants";
import { fetchWorldYears } from "@/lib/data";
import { buildSocialImageAlt, buildWorldSeo, socialImageUrl } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/seo";
import { parseLang } from "@/validators/lang";

export async function generateMetadata(): Promise<Metadata> {
  const years = await fetchWorldYears();
  const currentYear = Math.max(...years);
  const seoDetails = buildWorldSeo({
    year: String(currentYear),
    lang: DEFAULT_LANG,
    currency: DEFAULT_CURRENCY,
  });

  return {
    title: seoDetails.title,
    description: seoDetails.description,
    keywords: seoDetails.keywords,
    alternates: {
      canonical: seoDetails.pageUrl,
      languages: seoDetails.languageAlternates,
    },
    openGraph: {
      type: "website",
      title: seoDetails.title,
      description: seoDetails.description,
      url: seoDetails.pageUrl,
      siteName: SITE_NAME,
      locale: seoDetails.openGraphLocale,
      alternateLocale: seoDetails.openGraphAlternateLocales,
      images: [
        { url: socialImageUrl, alt: buildSocialImageAlt(seoDetails.worldName) },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seoDetails.title,
      description: seoDetails.description,
      images: [socialImageUrl],
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage() {
  const years = await fetchWorldYears();
  const currentYear = Math.max(...years);

  const h = await headers();
  const rawLang = h.get("accept-language");
  const detected = rawLang?.split(",")[0].split("-")[0];
  const lang = parseLang(detected);

  redirect(`/world/${currentYear}?lang=${lang}`);
}
