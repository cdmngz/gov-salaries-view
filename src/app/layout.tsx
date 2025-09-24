// src/app/layout.tsx

import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { type PropsWithChildren } from "react";
import "./globals.css";

import ServerFooter from "@/components/ServerFooter";
import SeoStructuredData from "@/components/SeoStructuredData";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_LANG } from "@/lib/constants";
import { serverEnv } from "@/lib/env";
import { SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME } from "@/lib/seo";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
});

const baseUrl = new URL(serverEnv.WEB_URL);

export const metadata: Metadata = {
  metadataBase: baseUrl,
  applicationName: SITE_NAME,
  icons: { icon: "/favicon.svg" },
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  category: "data",
  authors: [{ name: "OfficialSalaries.org" }],
  creator: "OfficialSalaries.org",
  publisher: "OfficialSalaries.org",
  alternates: {
    canonical: baseUrl.toString(),
  },
  openGraph: {
    type: "website",
    url: baseUrl.toString(),
    title: SITE_NAME,
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: new URL("/globe.svg", baseUrl).toString(),
        alt: "OfficialSalaries globe illustration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [new URL("/globe.svg", baseUrl).toString()],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      className={openSans.variable}
      lang={DEFAULT_LANG}
      suppressHydrationWarning
    >
      <head />
      <body className="flex flex-col min-h-screen">
        <SeoStructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1">{children}</div>
          <ServerFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
