// src/app/page.tsx

import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { parseLang } from "@/validators/lang";
import { DEFAULT_LANG } from "@/lib/constants";

export default async function HomePage() {
  const h = await headers();
  const accept = h.get("accept-language") ?? "";
  const primary = accept.split(",")[0] ?? "";
  const lang = parseLang(primary.split("-")[0] ?? DEFAULT_LANG);
  const year = new Date().getFullYear();
  permanentRedirect(`/world/${year}?lang=${lang}`);
}
