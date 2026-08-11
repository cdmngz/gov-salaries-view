import { Landmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { components } from "@/types/openapi";
import type { Language } from "@/validators/lang";

type Parties = components["schemas"]["Parties"];
type Party = components["schemas"]["Party"];

const wingLabels: Record<number, string> = {
  1: "Left",
  2: "Center-left",
  3: "Center",
  4: "Center-right",
  5: "Right",
};

export default function PartiesOverview({
  lang,
  parties,
}: {
  lang: Language;
  parties: Parties;
}) {
  const partyEntries = Object.entries(parties).sort(([, a], [, b]) =>
    a.range === b.range
      ? a.name.localeCompare(b.name)
      : a.range - b.range,
  );

  if (!partyEntries.length) return null;

  return (
    <Card className="w-full break-inside-avoid py-0 shadow-none">
      <CardContent className="space-y-5 p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Landmark className="size-4 text-primary" />
            Parties
          </h2>
          <Badge variant="secondary" className="rounded-full tabular-nums">
            {partyEntries.length}
          </Badge>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {partyEntries.map(([code, party]) => {
            const localizedName =
              (party as Party & Partial<Record<Language, string>>)[lang] ??
              party.name;

            return (
              <li
                key={code}
                className="flex min-w-0 items-start gap-3 rounded-lg border border-border/60 p-3"
              >
                <span
                  className="mt-1 size-3 shrink-0 rounded-full ring-2 ring-background"
                  style={{ backgroundColor: party.color }}
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-semibold">{code}</span>
                    <span className="text-xs text-muted-foreground">
                      {wingLabels[party.range]}
                    </span>
                  </div>
                  <p className="text-sm leading-snug">{localizedName}</p>
                  {party.en && party.en !== localizedName && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {party.en}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
