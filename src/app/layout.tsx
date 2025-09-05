// src/app/layout.tsx

import ServerFooter from "@/components/ServerFooter";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_LANG } from "@/lib/constants";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { type PropsWithChildren } from "react";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: {
    default: "OfficialSalaries",
    template: "%s | OfficialSalaries",
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
