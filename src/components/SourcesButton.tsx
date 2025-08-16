// src/components/GrossDisplay.tsx

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { components } from "@/types/openapi";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { z } from "zod";

const sourceEntrySchema = z
  .record(z.string(), z.union([z.number(), z.url(), z.string()]))
  .refine((obj) => Object.keys(obj).length === 1, {
    message: "Each source entry must have exactly one key",
  });

const sourcesSchema = z.array(sourceEntrySchema).min(1);

type SourceValue = string | number;

function classifyValue(
  value: SourceValue
): "url" | "email" | "number" | "string" {
  if (typeof value === "number") return "number";
  const s = String(value);
  if (z.url().safeParse(s).success) return "url";
  if (z.email().safeParse(s).success) return "email";
  return "string";
}

export function SourcesButton({
  sources,
}: {
  sources?: components["schemas"]["Sources"];
}) {
  if (!sources) return null;

  const parsed = sourcesSchema.safeParse(sources);
  if (!parsed.success) return null;

  const entries: Array<[string, SourceValue]> = parsed.data.map((obj) => {
    const [label, value] = Object.entries(obj)[0];
    return [label, value];
  });

  if (entries.length === 0) return null;

  return (
    <p>
      <Tooltip>
        <TooltipTrigger>
          <InfoCircledIcon className="size-3 mt-1" />
        </TooltipTrigger>
        <TooltipContent className="bg-card text-primary shadow-md py-4 px-6">
          <div className="space-y-2">
            {entries.map(([label, value], i) => {
              const type = classifyValue(value);
              const key = `${label}-${i}`;

              return (
                <div key={key} className="flex justify-between gap-2">
                  <span className="font-medium">{label}:</span>

                  {type === "url" ? (
                    <Link
                      href={String(value)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 gap-1 underline truncate"
                      title={String(value)}
                    >
                      {String(value)}
                    </Link>
                  ) : type === "email" ? (
                    <Link
                      href={`mailto:${value}`}
                      className="text-blue-600 underline truncate"
                      title={String(value)}
                    >
                      {String(value)}
                    </Link>
                  ) : (
                    <span className="truncate" title={String(value)}>
                      {String(value)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </TooltipContent>
      </Tooltip>
    </p>
  );
}
