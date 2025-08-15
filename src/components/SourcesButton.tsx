// src/components/GrossDisplay.tsx

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { z } from "zod";

const sourcesSchema = z.record(z.string(), z.union([z.string(), z.number()]));

function classifyValue(
  value: string | number
): "url" | "email" | "number" | "string" {
  if (typeof value === "number") return "number";
  if (z.url().safeParse(value).success) return "url";
  if (z.email().safeParse(value).success) return "email";
  return "string";
}

export function SourcesButton({
  sources,
}: {
  sources?: Record<string, string | number>;
}) {
  const parsed = sourcesSchema.safeParse(sources);
  const hasSources = parsed.success && Object.keys(parsed.data).length > 0;

  return (
    <p>
      {hasSources && (
        <Tooltip>
          <TooltipTrigger>
            <InfoCircledIcon className="size-3 mt-1" />
          </TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={6}
            className="bg-card text-primary shadow-md py-4 px-6"
          >
            <div className="space-y-2 ">
              {Object.entries(parsed.data).map(([label, value]) => {
                const type = classifyValue(value);

                return (
                  <div key={label} className="flex justify-between gap-2">
                    <span className="font-medium">{label}:</span>
                    {type === "url" ? (
                      <a
                        href={String(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 gap-1 underline inline-flex"
                      >
                        {value}
                      </a>
                    ) : type === "email" ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-blue-600 underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </p>
  );
}
