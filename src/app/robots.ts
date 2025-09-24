// src/app/robots.ts

import type { MetadataRoute } from "next";

import { serverEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = serverEnv.WEB_URL.replace(/\/+$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };
}
