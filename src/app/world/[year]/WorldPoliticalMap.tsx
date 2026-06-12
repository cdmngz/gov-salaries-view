"use client";

import MapLegend from "@/app/world/[year]/maps/MapLegend";
import { type LegendCounts } from "@/app/world/[year]/parts/RangeLegend";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DataShape,
  GEO_URL,
  RANGE_LABELS,
  RangeValue,
  Wing,
  buildIso2Map,
  fillForIso2,
  localizedName,
  shade,
} from "@/lib/map-colors";
import { cn } from "@/lib/utils";
import type { Language } from "@/validators/lang";
import {
  LocateFixed,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
} from "lucide-react";
import { type KeyboardEvent, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
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

type ActiveCountry = {
  iso_a2: string;
  name: string;
  wing: Wing;
  range?: RangeValue;
};

const INITIAL_CENTER: [number, number] = [0, 15];

function formatWing(wing: Wing) {
  if (wing === "empty") return "No data";

  return wing.replace("-", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

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
  const [center, setCenter] = useState<[number, number]>(INITIAL_CENTER);
  const [activeCountry, setActiveCountry] =
    useState<ActiveCountry | null>(null);

  const coveredCountries = byIso2.size;
  const totalClassified = useMemo(
    () =>
      legendCounts
        ? Object.values(legendCounts).reduce(
            (sum, count) => sum + (count ?? 0),
            0
          )
        : coveredCountries,
    [coveredCountries, legendCounts]
  );
  const zoomPercent = Math.round(
    ((zoom - minZoom) / (maxZoom - minZoom)) * 100
  );

  const resetMap = () => {
    setZoom(initialZoom);
    setCenter(INITIAL_CENTER);
  };

  const selectCountry = (country: ActiveCountry) => {
    setActiveCountry(country);
    onCountryClick?.({
      iso_a2: country.iso_a2,
      name: country.name,
      wing: country.wing,
      range: country.range,
    });
  };

  const onCountryKeyDown = (
    event: KeyboardEvent<SVGPathElement>,
    country: ActiveCountry
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    selectCountry(country);
  };

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-5xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl",
        className
      )}
      aria-label="Interactive world political map"
    >
      <div className="flex flex-col gap-4 border-b border-border/70 bg-gradient-to-br from-primary/10 via-card to-card p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <LocateFixed className="size-3.5" aria-hidden="true" />
            2D political map
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Explore countries by political range
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Pan, zoom, and select any country to inspect its current category
              without leaving the overview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <div className="rounded-2xl border border-border/70 bg-background/75 px-3 py-2 shadow-sm">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Countries
            </div>
            <div className="text-lg font-semibold">{coveredCountries}</div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/75 px-3 py-2 shadow-sm">
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Classified
            </div>
            <div className="text-lg font-semibold">{totalClassified}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:p-5">
        <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-border/60 bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklab,var(--color-primary)_16%,transparent),transparent_35%),linear-gradient(180deg,color-mix(in_oklab,var(--color-background)_88%,var(--color-primary)_12%),var(--color-background))] shadow-inner">
          <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-center justify-between gap-2">
            <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              Drag to pan · Scroll disabled
            </div>
            <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              Zoom {zoomPercent}%
            </div>
          </div>

          <TooltipProvider delayDuration={100}>
            <ComposableMap
              projectionConfig={{ scale: 160 }}
              style={{ width: "100%", height: "100%", touchAction: "none" }}
              className="min-h-[22rem] transition-transform duration-300"
              onWheel={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onWheelCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Sphere
                id="world-map-sphere"
                fill="transparent"
                stroke="color-mix(in oklab, var(--color-primary) 16%, transparent)"
                strokeWidth={0.7}
              />
              <Graticule
                stroke="color-mix(in oklab, var(--color-primary) 18%, transparent)"
                strokeWidth={0.45}
              />
              <ZoomableGroup
                zoom={zoom}
                center={center}
                onMoveEnd={(p: { coordinates: [number, number]; zoom: number }) => {
                  setCenter(p.coordinates);
                  setZoom(p.zoom);
                }}
                minZoom={minZoom}
                maxZoom={maxZoom}
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
                      const stroke =
                        "color-mix(in oklab, var(--color-background) 80%, var(--color-foreground))";
                      const country = { iso_a2: iso2, name, wing, range };
                      const isActive = activeCountry?.iso_a2 === iso2;

                      return (
                        <Tooltip key={`fill-${geo.id ?? iso2 ?? idx}`}>
                          <TooltipTrigger asChild>
                            <Geography
                              geography={geo}
                              tabIndex={0}
                              role="button"
                              aria-pressed={isActive}
                              aria-label={`${name}: ${formatWing(wing)}`}
                              onMouseEnter={() => setActiveCountry(country)}
                              onFocus={() => setActiveCountry(country)}
                              onClick={() => selectCountry(country)}
                              onKeyDown={(event) =>
                                onCountryKeyDown(event, country)
                              }
                              style={{
                                default: {
                                  fill,
                                  outline: "none",
                                  stroke,
                                  strokeWidth: isActive ? 1.1 : 0.45,
                                  cursor: "pointer",
                                  filter: isActive
                                    ? "drop-shadow(0 4px 10px rgb(15 23 42 / 0.25))"
                                    : "none",
                                  transition:
                                    "fill 160ms ease, stroke-width 160ms ease, filter 160ms ease",
                                },
                                hover: {
                                  fill: fill.startsWith("#")
                                    ? shade(fill, -8)
                                    : fill,
                                  outline: "none",
                                  stroke: "var(--color-primary)",
                                  strokeWidth: 1.1,
                                  filter:
                                    "drop-shadow(0 5px 12px rgb(15 23 42 / 0.28))",
                                },
                                pressed: {
                                  fill: fill.startsWith("#")
                                    ? shade(fill, -15)
                                    : fill,
                                  outline: "none",
                                  stroke: "var(--color-primary)",
                                  strokeWidth: 1.2,
                                },
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="border-border/70 bg-popover/95 text-xs shadow-xl backdrop-blur"
                          >
                            <div className="font-semibold">{name}</div>
                            <div className="text-muted-foreground">
                              {formatWing(wing)}
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
        </div>

        <aside className="flex flex-col gap-3">
          <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-3 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Map controls</div>
                <div className="text-xs text-muted-foreground">
                  Fine-tune the viewport
                </div>
              </div>
              <Maximize2
                className="size-4 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                aria-label="Zoom out"
                className="rounded-full bg-card shadow-none"
                onClick={() => setZoom((z) => Math.max(minZoom, z / 1.3))}
                variant="outline"
                size="icon-sm"
              >
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <Slider
                aria-label="Map zoom"
                min={minZoom}
                max={maxZoom}
                step={0.05}
                value={[zoom]}
                onValueChange={([value]) => setZoom(value ?? zoom)}
              />
              <Button
                aria-label="Zoom in"
                className="rounded-full bg-card shadow-none"
                onClick={() => setZoom((z) => Math.min(maxZoom, z * 1.3))}
                variant="outline"
                size="icon-sm"
              >
                <Plus className="size-4" aria-hidden="true" />
              </Button>
            </div>

            <Button
              className="mt-3 w-full rounded-full bg-card shadow-none"
              onClick={resetMap}
              variant="outline"
              size="sm"
            >
              Reset view
            </Button>
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MousePointer2
                className="size-4 text-primary"
                aria-hidden="true"
              />
              Selected country
            </div>
            {activeCountry ? (
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-semibold leading-tight">
                    {activeCountry.name}
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {activeCountry.iso_a2}
                  </div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-3">
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div className="mt-1 flex items-center gap-2 font-medium">
                    <span
                      className="size-3 rounded-full border border-border"
                      style={{
                        backgroundColor: fillForIso2(
                          byIso2,
                          activeCountry.iso_a2
                        ),
                      }}
                      aria-hidden="true"
                    />
                    {activeCountry.range
                      ? RANGE_LABELS[activeCountry.range]
                      : formatWing(activeCountry.wing)}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Hover or tap a country to preview its category here.
              </p>
            )}
          </div>

          <div className="rounded-[1.5rem] border border-border/70 bg-background/75 p-4 shadow-sm backdrop-blur">
            <div className="mb-3 text-sm font-semibold">Legend</div>
            <MapLegend counts={legendCounts} />
          </div>
        </aside>
      </div>
    </section>
  );
}
