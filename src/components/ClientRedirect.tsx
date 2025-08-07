// src/components/ClientRedirect.tsx

"use client";

import { DEFAULT_COUNTRY } from "@/lib/constants";
import { parseLang } from "@/validators/lang";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VALID_COUNTRIES = ["ar", "es"];
const CACHE_KEY = "lastDetectedLocation";
const CACHE_TTL_MS = 1000 * 60 * 60 * 48; // 48h

type CachedLocation = {
  country: string;
  lang: string;
  timestamp: number;
};

function getCache(): CachedLocation | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.country || !parsed?.timestamp) return null;
    return parsed;
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function isCacheValid(entry: CachedLocation | null): boolean {
  if (!entry) return false;
  const age = Date.now() - entry.timestamp;
  return age < CACHE_TTL_MS;
}

async function detectLocation(): Promise<CachedLocation> {
  const browserLangRaw = navigator.language.split("-")[0];
  const lang = parseLang(browserLangRaw);

  try {
    const res = await fetch("https://ipapi.co/json/");
    const json = await res.json();
    const country = json.country_code?.toLowerCase() || DEFAULT_COUNTRY;

    return {
      country,
      lang,
      timestamp: Date.now(),
    };
  } catch {
    return {
      country: DEFAULT_COUNTRY,
      lang,
      timestamp: Date.now(),
    };
  }
}

export default function ClientRedirect() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const firstSegment = currentPath.split("/")[1];

    if (VALID_COUNTRIES.includes(firstSegment)) return;

    const cached = getCache();

    if (isCacheValid(cached) && VALID_COUNTRIES.includes(cached!.country)) {
      router.replace(
        `/${cached!.country}/${new Date().getFullYear()}?lang=${cached!.lang}`
      );
      return;
    }

    const handleRedirect = async () => {
      setRedirecting(true);
      const location = await detectLocation();

      const safeCountry = VALID_COUNTRIES.includes(location.country)
        ? location.country
        : DEFAULT_COUNTRY;

      const cacheEntry: CachedLocation = {
        country: safeCountry,
        lang: location.lang,
        timestamp: Date.now(),
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheEntry));

      router.replace(`/${safeCountry}?lang=${location.lang}`);
    };

    handleRedirect();
  }, [router]);

  return redirecting ? (
    <p className="text-center mt-10 text-gray-500">
      Detectando tu ubicación...
    </p>
  ) : null;
}
