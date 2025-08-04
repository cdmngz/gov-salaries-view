// src/hooks/useOfficials.ts

"use client";

import { buildDataUrl, fetchCountryPeriods } from "@/lib/data";
import type {
  CountryCode,
  Data,
  Official,
  Rates,
  Salary,
  SectionKey,
  CountryPeriod,
} from "@/types";
import { sections, sectionToBranchMap } from "@/types";
import { useEffect, useState } from "react";

export function useOfficials(country: CountryCode) {
  const [officials, setOfficials] = useState<Official[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [baseCurrency, setBaseCurrency] = useState<string>("");
  const [rates, setRates] = useState<Rates | null>(null);

  const [periods, setPeriods] = useState<CountryPeriod[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [semester, setSemester] = useState<1 | 2>(1);

  useEffect(() => {
    let active = true;
    setLoading(true);

    (async () => {
      try {
        const fetchedPeriods = await fetchCountryPeriods(country);
        if (!active) return;
        setPeriods(fetchedPeriods);

        const last = fetchedPeriods[fetchedPeriods.length - 1] ?? {
          year: new Date().getFullYear(),
          semester: 1,
        };
        setYear(last.year);
        setSemester(last.semester);

        const urls = buildDataUrl(country, last.year, last.semester);
        const dataRes = await fetch(urls.data);
        const ratesRes = await fetch(urls.rates);
        const data = (await dataRes.json()) as Data;
        const ratesObj = (await ratesRes.json()) as Rates;
        if (!active) return;

        setBaseCurrency(data.baseCurrency ?? "USD");
        setRates(ratesObj);

        const list: Official[] = sections.flatMap((section: SectionKey) => {
          const raw = data[section];
          if (!raw) return [];
          const items = Array.isArray(raw) ? raw : [raw];
          return items.map((item: Official) => ({
            branch: sectionToBranchMap[section],
            name: item.name,
            gender: item.gender,
            role: item.role,
            party: item.party,
            salary: item.salary as Salary,
            district: item.district,
          }));
        });
        setOfficials(list);
      } catch (err) {
        console.error("❌ Failed to load officials:", err);
        if (active) setOfficials([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [country]);

  return {
    officials,
    loading,
    baseCurrency,
    rates,
    periods,
    year,
    semester,
  };
}
