// src/components/RenderCountryPage.server.tsx

import React from "react";
import CountryPageBody from "@/components/CountryPageBody";
import { loadCountryData } from "@/lib/country";
import { notFound } from "next/navigation";
import { headers, cookies } from "next/headers";
import { Language } from "@/validators/lang";

interface RouteProps {
  params: Promise<{ country: string }>;
  searchParams: Promise<{
    lang?: Language;
    year?: string;
    semester?: string;
    currency?: string;
  }>;
}

export default async function RenderCountryPage(props: RouteProps) {
  const { country } = await props.params;
  const {
    lang,
    year: qYear,
    semester: qSemester,
    currency: qCurrency,
  } = await props.searchParams;

  const hdrs = headers();
  const cks = cookies();

  try {
    const data = await loadCountryData({
      params: { country },
      searchParams: {
        lang,
        year: qYear,
        semester: qSemester,
        currency: qCurrency,
      },
      headers: hdrs,
      cookies: cks,
    });
    return <CountryPageBody {...data} />;
  } catch {
    return notFound();
  }
}
