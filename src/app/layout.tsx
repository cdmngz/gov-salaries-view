// src/app/layout.tsx

import ServerFooter from "@/components/ServerFooter";
import { ThemeProvider } from "@/components/theme-provider";
import { DEFAULT_LANG } from "@/lib/constants";
import type { Metadata } from "next";
import { type PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/favicon.svg" },
  title: {
    default: "OfficialSalaries",
    template: "%s | OfficialSalaries",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang={DEFAULT_LANG} suppressHydrationWarning>
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
