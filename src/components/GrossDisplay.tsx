import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CURRENCY_SYMBOLS } from "@/lib/currencies";
import { InfoCircledIcon, Link1Icon } from "@radix-ui/react-icons";
import { z } from "zod";

type Props = {
  gross: number;
  currency: string;
  details?: Record<string, string | number>;
};

const detailsSchema = z.record(z.string(), z.union([z.string(), z.number()]));

export function GrossDisplay({ gross, currency, details }: Props) {
  const isBTC = currency === "BTC";
  const parsed = detailsSchema.safeParse(details);
  const hasDetails = parsed.success && Object.keys(parsed.data).length > 0;

  return (
    <p className="text-xs flex gap-1 items-center">
      Gross:{" "}
      {gross.toLocaleString(undefined, {
        minimumFractionDigits: isBTC ? 4 : 0,
        maximumFractionDigits: isBTC ? 4 : 0,
      })}{" "}
      {CURRENCY_SYMBOLS[currency]}
      {hasDetails && (
        <Tooltip>
          <TooltipTrigger>
            <InfoCircledIcon className="size-3 mb-0.5" />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            sideOffset={5}
            className="bg-card text-primary shadow-md p-3 border"
          >
            <div className="space-y-1 text-xs">
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
                        className="text-blue-600 underline"
                      >
                        <Link1Icon />
                      </a>
                    ) : type === "email" ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-blue-600 underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-primary">{String(value)}</span>
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

function classifyValue(
  value: string | number
): "url" | "email" | "number" | "string" {
  if (typeof value === "number") return "number";
  if (z.url().safeParse(value).success) return "url";
  if (z.email().safeParse(value).success) return "email";
  return "string";
}
