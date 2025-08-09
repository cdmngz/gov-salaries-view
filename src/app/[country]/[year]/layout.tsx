// src/app/[country]/[year]/layout.tsx

import { PropsWithChildren } from "react";

export const dynamic = "force-static";
export const dynamicParams = false;

export default async function CountryYearLayout({
  children,
}: PropsWithChildren) {
  return <div className="flex-1">{children}</div>;
}
