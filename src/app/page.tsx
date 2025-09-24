// src/app/page.tsx

import type { Metadata } from "next";

import ClientRedirect from "@/components/ClientRedirect";
import { serverEnv } from "@/lib/env";
import { SITE_DESCRIPTION } from "@/lib/seo";

const baseUrl = serverEnv.WEB_URL.replace(/\/+$/, "");

export const metadata: Metadata = {
  title: "Explore public officials salaries",
  description: SITE_DESCRIPTION,
  alternates: { canonical: baseUrl },
  openGraph: {
    title: "Explore public officials salaries",
    description: SITE_DESCRIPTION,
    url: baseUrl,
  },
};

export default function HomePage() {
  return <ClientRedirect />;
}
