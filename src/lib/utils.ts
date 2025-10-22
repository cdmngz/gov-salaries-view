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
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency ?? DEFAULT_CURRENCY,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
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
