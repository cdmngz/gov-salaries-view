"use client";

import MapLegend from "@/app/world/[year]/maps/MapLegend";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DataShape,
  GEO_URL,
  RangeValue,
  Wing,
  buildIso2Map,
  fillForIso2,
  localizedName,
  shade,
} from "@/lib/map-colors";
import { cn } from "@/lib/utils";
import type { Language } from "@/validators/lang";
import { useCallback, useMemo, useState } from "react";
import { type LegendCounts } from "./parts/RangeLegend";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

type Geometry =
  | { type: "Point"; coordinates: [number, number] }
  | {
      type:
        | "MultiPoint"
        | "LineString"
        | "MultiLineString"
        | "Polygon"
        | "MultiPolygon";
      coordinates: unknown;
    }
  | { type: "GeometryCollection"; geometries: Geometry[] };

type Feature<G = Geometry, P = Record<string, unknown>> = {
  type: "Feature";
  id?: string | number;
  properties: P | null;
  geometry: G | null;
};

type CountryProps = {
  ISO2?: string;
  ISO_A2?: string;
  [k: string]: unknown;
};

type CountryFeature = Feature<Geometry, CountryProps>;

export default function WorldPoliticalMap({
  data,
  className,
  initialZoom = 1.05,
  minZoom = 0.8,
  maxZoom = 6,
  lang,
  legendCounts,
  onCountryClick,
}: {
  data: DataShape;
  className?: string;
  initialZoom?: number;
  minZoom?: number;
  maxZoom?: number;
  lang: Language;
  legendCounts?: LegendCounts;
  onCountryClick?: (p: {
    iso_a2: string;
    name?: string;
    wing: Wing;
    range?: RangeValue;
  }) => void;
}) {
  const byIso2 = useMemo(() => buildIso2Map(data, lang), [data, lang]);
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState<[number, number]>([0, 15]);

  const filterZoomEvent = useCallback(
    (event: Event | { type?: string } | null) => {
      const eventType =
        event && typeof event === "object" && "type" in event
          ? event.type
          : undefined;

      if (typeof eventType === "string") {
        return !["wheel", "mousewheel", "DOMMouseScroll"].includes(eventType);
      }

      return false;
    },
    []
  );

  return (
    <div className={cn("mx-auto w-full max-w-4xl  bg-card p-3", className)}>
      <div className="mb-2 flex items-center justify-end gap-2">
        <Button
          className="bg-card shadow-none"
          onClick={() => setZoom((z) => Math.min(maxZoom, z * 1.3))}
          variant="outline"
          size="sm"
        >
          +
        </Button>
        <Button
          className="bg-card shadow-none"
          onClick={() => setZoom((z) => Math.max(minZoom, z / 1.3))}
          variant="outline"
          size="sm"
        >
          -
        </Button>
        <Button
          className="bg-card shadow-none"
          onClick={() => {
            setZoom(initialZoom);
            setCenter([0, 15]);
          }}
          variant="outline"
          size="sm"
        >
          Reset
        </Button>
      </div>

      <TooltipProvider delayDuration={150}>
        <ComposableMap
          projectionConfig={{ scale: 160 }}
          style={{ width: "100%", height: "auto", touchAction: "none" }}
          onWheelCapture={(event) => event.preventDefault()}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={(p: { coordinates: [number, number]; zoom: number }) => {
              setCenter(p.coordinates);
              setZoom(p.zoom);
            }}
            minZoom={minZoom}
            maxZoom={maxZoom}
            filterZoomEvent={filterZoomEvent}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: CountryFeature[] }) =>
                geographies.map((geo, idx) => {
                  const props = geo.properties ?? {};
                  const iso2 = String(
                    props.ISO2 ?? props.ISO_A2 ?? ""
                  ).toUpperCase();
                  const rec = byIso2.get(iso2);
                  const name = rec?.name ?? localizedName(iso2, lang);
                  const wing = rec?.wing ?? "empty";
                  const range = rec?.range;
                  const fill = fillForIso2(byIso2, iso2);
                  const stroke = "#56B";
                  return (
                    <Tooltip key={`fill-${geo.id ?? iso2 ?? idx}`}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          tabIndex={0}
                          role="button"
                          aria-label={`${name}: ${wing}`}
                          onClick={() =>
                            onCountryClick?.({
                              iso_a2: iso2,
                              name,
                              wing,
                              range,
                            })
                          }
                          style={{
                            default: {
                              fill,
                              outline: "none",
                              stroke,
                              strokeWidth: 0.6,
                              cursor: "pointer",
                            },
                            hover: {
                              fill: fill.startsWith("#")
                                ? shade(fill, -8)
                                : fill,
                              outline: "none",
                              stroke,
                              strokeWidth: 0.8,
                            },
                            pressed: {
                              fill: fill.startsWith("#")
                                ? shade(fill, -15)
                                : fill,
                              outline: "none",
                              stroke,
                              strokeWidth: 0.8,
                            },
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div className="font-medium">{name}</div>
                        <div className="text-muted-foreground">
                          {wing === "empty"
                            ? "No data"
                            : wing
                                .replace("-", " ")
                                .replace(/\b\w/g, (m) => m.toUpperCase())}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </TooltipProvider>

      <MapLegend counts={legendCounts} />
    </div>
  );
}
