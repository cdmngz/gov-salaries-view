// /src/validators/lang.ts

import { DEFAULT_LANG } from "@/lib/constants";
import { z } from "zod";

export const LanguageSchema = z.enum(["en", "es"]);
export type Language = z.infer<typeof LanguageSchema>;

export const LanguageLabels: Record<Language, string> = {
  en: "English",
  es: "Español",
};

export function parseLang(input: unknown): Language {
  const result = LanguageSchema.safeParse(input);
  return result.success ? result.data : DEFAULT_LANG;
}
