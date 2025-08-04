import { NextRequest, NextResponse } from "next/server";
import countries from "./src/data/countries.json";
import { CountriesData } from "@/types";
import { DEFAULT_LANG } from "@/lib/constants";

const countryMetadata = countries as CountriesData;

export function middleware(request: NextRequest) {
  const detectedCountry =
    request.headers.get("cloudfront-viewer-country")?.toLowerCase() ||
    DEFAULT_LANG;

  const supportedCountryCodes = Object.keys(countryMetadata);

  const pathname = request.nextUrl.pathname;

  const alreadyRedirected = request.cookies.get("redirected");

  if (pathname === "/" && !alreadyRedirected) {
    if (supportedCountryCodes.includes(detectedCountry)) {
      const response = NextResponse.redirect(
        new URL(`/${detectedCountry}`, request.url)
      );
      response.cookies.set("redirected", "1", { path: "/", maxAge: 60 * 60 });
      return response;
    }

    const response = NextResponse.redirect(new URL("/intl", request.url));
    response.cookies.set("redirected", "1", { path: "/", maxAge: 60 * 60 });
    return response;
  }

  return NextResponse.next();
}
