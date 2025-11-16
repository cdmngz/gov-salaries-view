// src/app/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { fetchWorldYears } from "@/lib/data";
import { parseLang } from "@/validators/lang";

export default async function HomePage() {
  const years = await fetchWorldYears();
  const currentYear = Math.max(...years);

  const h = await headers();
  const rawLang = h.get("accept-language");
  const detected = rawLang?.split(",")[0].split("-")[0];
  const lang = parseLang(detected);

  redirect(`/world/${currentYear}?lang=${lang}`);
}
