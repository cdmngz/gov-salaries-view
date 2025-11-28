// src/hooks/useOfficials.ts
"use client";

import { fetchCountryData, fetchCountryPeriods } from "@/lib/data";
import type { CountryCode, SectionKey } from "@/types";
import { sections, sectionToBranchMap } from "@/types";
import { components } from "@/types/openapi";
import { useEffect, useState } from "react";

export function useOfficials(country: CountryCode) {
  const [officials, setOfficials] = useState<
    components["schemas"]["Official"][]
  >([]);
  const [loading, setLoading] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState("");
  const [rates, setRates] = useState<components["schemas"]["WorldRates"] | null>(
    null
  );
  const [periods, setPeriods] = useState<
    components["schemas"]["CountryYears"] | null
  >(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function loadData() {
      setLoading(true);
      try {
        const fetchedPeriods = await fetchCountryPeriods(country);
        if (signal.aborted) return;

        setPeriods(fetchedPeriods);

        const lastYear =
          [...fetchedPeriods].sort((a, b) => b - a).at(0) ??
          new Date().getFullYear();
        setYear(lastYear);

        const { data, rates: fetchedRates } = await fetchCountryData(
          country,
          lastYear
        );
        if (signal.aborted) return;

        setBaseCurrency(data.baseCurrency ?? "USD");
        setRates(fetchedRates);

        const list: components["schemas"]["Official"][] = sections.flatMap(
          (section: SectionKey) => {
            const raw = data[section];
            if (!raw) return [];
            const items = Array.isArray(raw) ? raw : [raw];
            return items.map((item) => ({
              branch: sectionToBranchMap[section],
              name: item.name,
              gender: item.gender,
              role: item.role,
              party: item.party,
              salary: item.salary,
              district: item.district,
            }));
          }
        );

        setOfficials(list);
      } catch (err) {
        if (!signal.aborted) {
          console.error("❌ Failed to load officials:", err);
          setOfficials([]);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadData();
    return () => controller.abort();
  }, [country]);

  return { officials, loading, baseCurrency, rates, periods, year };
}
