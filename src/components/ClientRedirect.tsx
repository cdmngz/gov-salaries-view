// src/components/ClientRedirect.tsx

"use client";

import { DEFAULT_COUNTRY } from "@/lib/constants";
import { parseLang } from "@/validators/lang";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const VALID_COUNTRIES = ["ar", "es"];
const CACHE_KEY = "lastDetectedLocation";
const CACHE_TTL_HOURS = 48;

type CachedLocation = {
  country: string;
  lang: string;
  timestamp: number;
};

function isCacheValid(entry: CachedLocation | null): boolean {
  if (!entry) return false;
  const age = Date.now() - entry.timestamp;
  const ttl = CACHE_TTL_HOURS * 60 * 60 * 1000;
  return age < ttl;
}

export default function ClientRedirect() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const firstSegment = currentPath.split("/")[1];

    if (VALID_COUNTRIES.includes(firstSegment)) return;

    const rawCache = localStorage.getItem(CACHE_KEY);
    let cached: CachedLocation | null = null;

    try {
      if (rawCache) {
        cached = JSON.parse(rawCache);
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }

    if (cached && isCacheValid(cached)) {
      router.replace(`/${cached.country}?lang=${cached.lang}`);
      return;
    }

    const detectAndRedirect = async () => {
      setRedirecting(true);

      const browserLangRaw = navigator.language.split("-")[0];
      const lang = parseLang(browserLangRaw);

      try {
        const res = await fetch("https://ipapi.co/json/");
        const json = await res.json();
        const country = json.country_code?.toLowerCase() || DEFAULT_COUNTRY;

        const newCache: CachedLocation = {
          country,
          lang,
          timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(newCache));

        router.replace(`/${country}?lang=${lang}`);
      } catch (err) {
        console.warn("Error detectando ubicación:", err);

        const fallbackCache: CachedLocation = {
          country: DEFAULT_COUNTRY,
          lang,
          timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(fallbackCache));

        router.replace(`/${DEFAULT_COUNTRY}?lang=${lang}`);
      }
    };

    detectAndRedirect();
  }, [router]);

  return redirecting ? (
    <p className="text-center mt-10 text-gray-500">
      Detectando tu ubicación...
    </p>
  ) : null;
}
