// /src/validators/lang.ts

import { DEFAULT_LANG } from "@/lib/constants";
import { z } from "zod";

export const LanguageSchema = z.enum(["en", "es", "fr", "pt", "de"]);
export type Language = z.infer<typeof LanguageSchema>;

export function parseLang(input?: string | null): Language {
  const result = LanguageSchema.safeParse(input);
  return result.success ? result.data : DEFAULT_LANG;
}
