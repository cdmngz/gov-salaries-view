// src/app/world/[year]/ClientView.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientView from "./ClientView";
import type { components } from "@/types/openapi";

vi.mock("next/navigation", () => ({
  useParams: () => ({ year: "2024" }),
  useSearchParams: () => {
    const usp = new URLSearchParams();
    return {
      get: (key: string) => usp.get(key),
      toString: () => usp.toString(),
    };
  },
}));

vi.mock("./DataTable", () => ({
  DataTable: ({ data }: { data: Array<{ countryName: string }> }) => (
    <div data-testid="mock-datatable">
      {data.map((r) => (
        <div key={r.countryName} data-testid="row-country">
          {r.countryName}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/lib/constants", () => ({ DEFAULT_CURRENCY: "USD" }));
vi.mock("@/lib/utils", () => ({
  convert: (val: number) => val,
  formatCurrency: (val: number) => String(val),
}));
vi.mock("@/validators/lang", () => ({
  parseLang: () => "en" as const,
}));
vi.mock("@/i18n", () => ({
  TEXT_TRANSLATION: { stats: { en: "Stats" } },
}));
vi.mock("@/data/countries.json", () => ({
  default: {
    world: { flag: "🌍", names: { en: "World" } },
    ES: { flag: "🇪🇸", names: { en: "Spain" } },
  },
}));

describe("<ClientView />", () => {
  let data: components["schemas"]["WorldData"];
  let rates: components["schemas"]["Rates"];

  beforeEach(() => {
    const worldData = {
      ES: {
        partyRangeStatsSplit: {
          executive: { mostPopularRanges: [4] },
          rest: { mostPopularRanges: [3] },
        },
        minAnnualSalary: 15000,
        GDP: 1200000,
        GDPPerCapita: 30000,
        ministers: { budget: 50000, quantity: 20 },
        deputies: { quantity: 350 },
        senate: { quantity: 265 },
      },
    };

    data = worldData as unknown as components["schemas"]["WorldData"];
    rates = {
      base: "USD",
      rates: { USD: 1 },
    } as unknown as components["schemas"]["Rates"];
  });

  it("renders title and rows", () => {
    render(<ClientView data={data} rates={rates} />);
    expect(screen.getByTestId("world-stats-title")).toHaveTextContent(
      "🌍 World - Stats"
    );
    const rows = screen.getAllByTestId("row-country");
    expect(rows[0]).toHaveTextContent("Spain ES");
  });
});
