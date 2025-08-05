// src/components/RenderCountryPage.server.tsx

import CountryPageBody from "@/components/CountryPageBody";
import { loadCountryData } from "@/lib/country";
import { Language } from "@/validators/lang";
import { notFound } from "next/navigation";

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

  try {
    const data = await loadCountryData({
      params: { country },
      searchParams: {
        lang,
        year: qYear,
        semester: qSemester,
        currency: qCurrency,
      },
    });
    return <CountryPageBody {...data} />;
  } catch {
    return notFound();
  }
}
