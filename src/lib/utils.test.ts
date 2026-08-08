// @vitest-environment node

import { describe, expect, it } from "vitest";

import { formatCurrency } from "./utils";

describe("formatCurrency", () => {
  it.each([
    [1_000, "$1K"],
    [1_003.85, "$1K"],
    [2_022, "$2K"],
    [3_987, "$4K"],
    [50_100_999, "$50M"],
    [55_000_000, "$55M"],
    [55_999_999, "$56M"],
    [1_000_000_000, "$1B"],
    [1_000_000_000_000, "$1T"],
    [1_000_000_000_000_000, "$1Q"],
  ])("formats %s as %s", (amount, expected) => {
    expect(formatCurrency(amount, "USD")).toBe(expected);
  });

  it("promotes a rounded value to the next suffix", () => {
    expect(formatCurrency(999_999, "USD")).toBe("$1M");
  });

  it("keeps precision for amounts below one thousand", () => {
    expect(formatCurrency(999.85, "USD")).toBe("$999.85");
  });
});
