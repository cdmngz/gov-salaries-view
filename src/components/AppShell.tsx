// /src/components/AppShell.tsx
"use client";

import countriesData from "@/data/countries.json";
import { useOfficials } from "@/hooks/useOfficials";
import { DEFAULT_COUNTRY, DEFAULT_CURRENCY } from "@/lib/constants";
import type { CountryCode } from "@/types";
import { parseLang } from "@/validators/lang";
import { usePathname, useSearchParams } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [, pathCountry] = pathname.split("/");
  const country: CountryCode =
    pathCountry in countriesData
      ? (pathCountry as CountryCode)
      : DEFAULT_COUNTRY;

  const { baseCurrency, rates, periods, year, semester } =
    useOfficials(country);

  const currency =
    searchParams.get("currency") || rates?.baseCurrency || DEFAULT_CURRENCY;

  const lang = parseLang(searchParams.get("lang"));

  return (
    <>
      <Header
        country={country}
        currency={currency}
        baseCurrency={baseCurrency}
        rates={rates}
        periods={periods}
        year={year}
        semester={semester}
        lang={lang}
      />

      <main className="flex-1">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
