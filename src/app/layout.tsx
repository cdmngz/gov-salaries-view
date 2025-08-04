// src/app/layout.tsx

import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import "./globals.css";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<Skeleton />}>
            <AppShell>{children}</AppShell>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
