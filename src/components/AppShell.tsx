"use client";

import countriesData from "@/data/countries.json";
import { useOfficials } from "@/hooks/useOfficials";
import {
  DEFAULT_COUNTRY,
  DEFAULT_CURRENCY,
  DEFAULT_LANG,
} from "@/lib/constants";
import { publicEnv } from "@/lib/env";
import type { CountryCode } from "@/types";
import { parseLang } from "@/validators/lang";
import { usePathname, useSearchParams } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const segments = pathname.split("/").filter(Boolean);
  const rawCountry = segments[0] ?? DEFAULT_COUNTRY;

  const country = (
    rawCountry in countriesData ? rawCountry : DEFAULT_COUNTRY
  ) as CountryCode;

  const { baseCurrency, rates, periods, year } = useOfficials(country);

  const currency =
    searchParams.get("currency") || rates?.baseCurrency || DEFAULT_CURRENCY;

  const lang = parseLang(searchParams.get("lang")) ?? DEFAULT_LANG;

  const version = publicEnv.NEXT_PUBLIC_GIT_VERSION;

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        country={country}
        currency={currency}
        baseCurrency={baseCurrency}
        rates={rates}
        periods={periods}
        year={year ?? new Date().getFullYear()}
        lang={lang}
      />

      <main className="flex-1">{children}</main>

      <Footer lang={lang} version={version} />
    </div>
  );
}
