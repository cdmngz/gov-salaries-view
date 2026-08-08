import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEFAULT_CURRENCY } from "./constants";

export function compareSalaryRatio(
  officialSalary: number,
  userSalary: number | null | undefined
): number | null {
  if (!userSalary || userSalary <= 0) return null;
  return Number((officialSalary / userSalary).toFixed(1));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convert(
  amount: number | null | undefined,
  fromCurr: string,
  toCurr: string,
  rates: Record<string, number>
): number {
  if (!amount) return 0;
  const fromRate = rates[fromCurr] ?? 1;
  const toRate = rates[toCurr] ?? 1;
  return (amount / fromRate) * toRate;
}

export function formatCurrency(
  amount: number | null | undefined,
  currency: string
): string {
  if (!amount) return "";

  const compactSuffixes = ["", "K", "M", "B", "T", "Q"];
  const absoluteAmount = Math.abs(amount);
  let magnitude = Math.min(
    Math.floor(Math.log10(absoluteAmount) / 3),
    compactSuffixes.length - 1
  );
  let displayedAmount = amount;

  if (magnitude > 0) {
    displayedAmount = Math.round(amount / 1000 ** magnitude);

    // Promote values that round to the next group (for example, 999,999 to 1M).
    if (
      Math.abs(displayedAmount) === 1000 &&
      magnitude < compactSuffixes.length - 1
    ) {
      magnitude += 1;
      displayedAmount = Math.round(amount / 1000 ** magnitude);
    }
  }

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency ?? DEFAULT_CURRENCY,
    maximumFractionDigits: magnitude > 0 ? 0 : 2,
  });
  const suffix = compactSuffixes[magnitude];

  if (!suffix) return formatter.format(displayedAmount);

  const parts = formatter.formatToParts(displayedAmount);
  const lastNumberPart = parts.findLastIndex((part) =>
    ["integer", "group", "decimal", "fraction"].includes(part.type)
  );

  return parts
    .map((part, index) => `${part.value}${index === lastNumberPart ? suffix : ""}`)
    .join("");
}

export function sortBy<T>(array: T[], key: keyof T, locale = "en"): T[] {
  return [...array].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];

    if (typeof valA === "string" && typeof valB === "string") {
      return valA.localeCompare(valB, locale, { sensitivity: "base" });
    }

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });
}
