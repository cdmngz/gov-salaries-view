const RANGE_VALUES = [1, 2, 3, 4, 5] as const;
export type RangeValue = (typeof RANGE_VALUES)[number];

export type Row = {
  code: string;
  codeLabel: string;
  displayName: string;
  flag: string | null;
  hasCountryPage: boolean;
  executiveRange?: RangeValue[];
  restRange?: RangeValue[];
  ministersQty: number;
  budget: number;
  gdp: number;
  gdpPerCapita: number;
  gdpPercent: number;
  deputiesQty: number;
  senateQty: number;
  countryName: string;
  total: number;
  minAnnualSalary: number;
};

export const rangeColorByValue: Record<RangeValue, string> = {
  1: "bg-red-400",
  2: "bg-red-200",
  3: "bg-gray-300",
  4: "bg-blue-200",
  5: "bg-blue-400",
};

export const WING_FILTER_VALUE_TO_RANGE = {
  left: 1,
  "left-center": 2,
  center: 3,
  "right-center": 4,
  right: 5,
} as const;

export type WingFilterValue = keyof typeof WING_FILTER_VALUE_TO_RANGE;
export type WingFilterSelection = WingFilterValue[];

export const isRangeValue = (n: number): n is RangeValue =>
  (RANGE_VALUES as readonly number[]).includes(n);
