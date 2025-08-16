import { components } from "@/types/openapi";
import WorldHeaderClient from "./WorldHeaderClient";

export default function WorldHeader({
  year,
  years,
  rates,
}: {
  year: number;
  years: number[];
  rates?: components["schemas"]["Rates"];
}) {
  return (
    <header className="w-full p-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white shadow">
      <div className="mx-auto max-w-screen-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="text-lg flex items-center gap-2 font-medium">
          <span aria-hidden>🌍</span>
          <span className="truncate">World overview</span>
        </div>
        <WorldHeaderClient defaultYear={year} years={years} rates={rates} />
      </div>
    </header>
  );
}
