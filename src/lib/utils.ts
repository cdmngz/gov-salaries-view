import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
