import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LANG } from "@/lib/constants";
import { parseLang } from "@/validators/lang";

function resolveLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LANG;

  const primary = acceptLanguage.split(",")[0]?.trim() ?? "";
  const normalized = primary.split("-")[0]?.trim() ?? "";

  return parseLang(normalized);
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const lang = resolveLanguage(request.headers.get("accept-language"));
  const year = new Date().getUTCFullYear();

  url.pathname = `/world/${year}`;
  url.searchParams.set("lang", lang);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
