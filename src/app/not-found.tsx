"use client";

import { useRouter } from "next/navigation";
import countriesJson from "@/data/countries.json";
import type { Language } from "@/validators/lang";
import { CountryCode } from "@/types";

type NotFoundProps = {
  lang?: Language;
  suggestedCountry?: string;
  suggestedYear?: number;
  availableCountries?: CountryCode[];
  availableYears?: number[];
};

export default function NotFound({
  lang = "en",
  suggestedCountry,
  suggestedYear,
  availableCountries,
  availableYears,
}: NotFoundProps) {
  const router = useRouter();

  const goTo = (country: string, year: number) => {
    router.push(`/${country}/${year}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      <p className="mb-6 text-gray-600">
        No se encontró el país o el año seleccionado.
      </p>

      {availableCountries && (
        <>
          <h2 className="font-semibold text-lg mb-2">Países disponibles:</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-md mb-6">
            {availableCountries.map((code) => {
              const meta = countriesJson[code];
              const flag = meta?.flag ?? "🌍";
              const name = meta?.names?.[lang] ?? code.toUpperCase();
              const year = suggestedYear ?? 2025;
              return (
                <button
                  key={code}
                  onClick={() => goTo(code, year)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  {flag} {name}
                </button>
              );
            })}
          </div>
        </>
      )}

      {availableYears && suggestedCountry && (
        <>
          <h2 className="font-semibold text-lg mb-2">
            Años disponibles para {suggestedCountry.toUpperCase()}:
          </h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-md">
            {availableYears.map((y) => (
              <button
                key={y}
                onClick={() => goTo(suggestedCountry, y)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                {y}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
