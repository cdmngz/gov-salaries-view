"use client";

import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  GEO_URL,
  DataShape,
  Wing,
  buildIso2Map,
  fillForIso2,
  shade,
  localizedName,
} from "@/lib/map-colors";
import type { Language } from "@/validators/lang";
import type { Feature, Geometry } from "geojson";
import { Button } from "@/components/ui/button";
import { useMemo, useRef, useState } from "react";
import MapLegend from "./maps/MapLegend";
import { type LegendCounts } from "./parts/RangeLegend";

type CountryProps = {
  ISO2?: string;
  ISO_A2?: string;
  [k: string]: unknown;
};

type CountryFeature = Feature<Geometry, CountryProps>;

export default function GlobeMap3D({
  data,
  className,
  ocean = "#3b82f6",
  stroke = "#56B",
  lang,
  legendCounts,
  onCountryClick,
}: {
  data: DataShape;
  className?: string;
  ocean?: string;
  stroke?: string;
  lang: Language;
  legendCounts?: LegendCounts;
  onCountryClick?: (p: { iso_a2?: string; name?: string; wing?: Wing }) => void;
}) {
  const byIso2 = useMemo(() => buildIso2Map(data, lang), [data, lang]);

  const [rotation, setRotation] = useState<[number, number, number]>([
    0, -10, 0,
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const lastTap = useRef<{ x: number; y: number; ts: number } | null>(null);

  const [scale, setScale] = useState(240);
  const MIN_SCALE = 140;
  const MAX_SCALE = 800;

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    dragging.current = true;
    setIsDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging.current || !last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRotation((r) => [r[0] + dx * 0.4, r[1] - dy * 0.4, 0]);
  }
  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    dragging.current = false;
    setIsDragging(false);
    last.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (e.pointerType === "touch") {
      const now = Date.now();
      if (lastTap.current) {
        const delta = now - lastTap.current.ts;
        const moved = Math.hypot(
          e.clientX - lastTap.current.x,
          e.clientY - lastTap.current.y
        );
        if (delta < 350 && moved < 20) {
          zoomBy(1.2);
          lastTap.current = null;
          return;
        }
      }
      lastTap.current = { x: e.clientX, y: e.clientY, ts: now };
    }
  }

  function zoomBy(f: number) {
    setScale((s) =>
      Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.round(s * f)))
    );
  }

  function resetView() {
    setScale(240);
    setRotation([0, -10, 0]);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-3 shadow-xl shadow-primary/5 backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-3 px-1 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight">
              Interactive 3D globe
            </h2>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              Default view
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag to rotate, double-tap or use the controls to zoom. Hover a
            country to see its salary range.
          </p>
        </div>

        <div className="flex w-full items-center gap-2 rounded-2xl border border-border/70 bg-background/70 p-1.5 sm:w-auto">
          <Button
            aria-label="Zoom in"
            className="flex-1 border-primary/20 bg-card/80 text-base font-semibold shadow-sm hover:bg-primary/10 sm:flex-none"
            onClick={() => zoomBy(1.2)}
            size="sm"
            variant="outline"
          >
            +
          </Button>
          <Button
            aria-label="Zoom out"
            className="flex-1 border-primary/20 bg-card/80 text-base font-semibold shadow-sm hover:bg-primary/10 sm:flex-none"
            onClick={() => zoomBy(1 / 1.2)}
            size="sm"
            variant="outline"
          >
            -
          </Button>
          <Button
            aria-label="Reset view"
            className="flex-1 border-primary/20 bg-card/80 shadow-sm hover:bg-primary/10 sm:flex-none"
            size="sm"
            onClick={resetView}
            variant="outline"
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-sky-200/50 bg-[radial-gradient(circle_at_50%_18%,rgba(125,211,252,0.28),transparent_32%),linear-gradient(180deg,rgba(14,165,233,0.10),rgba(99,102,241,0.06))] p-2 sm:p-4 dark:border-sky-400/20">
        <div className="pointer-events-none absolute inset-x-8 top-6 h-24 rounded-full bg-white/20 blur-3xl dark:bg-sky-300/10" />
        <TooltipProvider delayDuration={150}>
          <ComposableMap
            projection="geoOrthographic"
            projectionConfig={{ rotate: rotation, scale }}
            className={cn(
              "relative z-10 drop-shadow-2xl",
              isDragging ? "cursor-grabbing" : "cursor-grab"
            )}
            style={{ width: "100%", height: "auto", touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              dragging.current = false;
              setIsDragging(false);
              last.current = null;
            }}
          >
            <defs>
              <radialGradient id="globe-ocean-gradient" cx="35%" cy="25%" r="75%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="48%" stopColor={ocean} />
                <stop offset="100%" stopColor="#1e3a8a" />
              </radialGradient>
            </defs>
            <Sphere
              id="globe-sphere"
              fill="url(#globe-ocean-gradient)"
              stroke="#38bdf8"
              strokeOpacity={0.45}
              strokeWidth={1.2}
            />
            <Graticule stroke="#dbeafe" strokeOpacity={0.42} />

          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: CountryFeature[] }) => (
              <>
                {geographies.map((geo, idx) => {
                  const props = geo.properties;

                  const iso2 = String(
                    props.ISO2 ?? props.ISO_A2 ?? ""
                  ).toUpperCase();

                  const rec = byIso2.get(iso2);
                  const name = rec?.name ?? localizedName(iso2, lang);
                  const wing = rec?.wing ?? "empty";
                  const fill = fillForIso2(byIso2, iso2);

                  return (
                    <Tooltip key={`fill-${String(geo.id ?? iso2 ?? idx)}`}>
                      <TooltipTrigger asChild>
                        <Geography
                          geography={geo}
                          onClick={() =>
                            onCountryClick?.({ iso_a2: iso2, name, wing })
                          }
                          style={{
                            default: {
                              fill,
                              stroke: "none",
                              outline: "none",
                              cursor: isDragging ? "grabbing" : "grab",
                            },
                            hover: {
                              fill: fill.startsWith("#")
                                ? shade(fill, -10)
                                : fill,
                              stroke: "none",
                              outline: "none",
                            },
                            pressed: {
                              fill: fill.startsWith("#")
                                ? shade(fill, -18)
                                : fill,
                              stroke: "none",
                              outline: "none",
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
                })}

                {geographies.map((geo, idx) => (
                  <Geography
                    key={`border-${String(geo.id ?? idx)}`}
                    geography={geo}
                    style={{
                      default: {
                        fill: "none",
                        stroke,
                        strokeOpacity: 0.95,
                        strokeWidth: 0.9,
                        vectorEffect: "non-scaling-stroke",
                        outline: "none",
                        pointerEvents: "none",
                      },
                      hover: {
                        fill: "none",
                        stroke,
                        strokeOpacity: 1,
                        strokeWidth: 0.9,
                        vectorEffect: "non-scaling-stroke",
                        outline: "none",
                        pointerEvents: "none",
                      },
                      pressed: {
                        fill: "none",
                        stroke,
                        strokeOpacity: 1,
                        strokeWidth: 0.9,
                        vectorEffect: "non-scaling-stroke",
                        outline: "none",
                        pointerEvents: "none",
                      },
                    }}
                  />
                ))}
              </>
            )}
          </Geographies>
        </ComposableMap>
        </TooltipProvider>
      </div>

      <div className="px-1 pt-1">
        <MapLegend counts={legendCounts} />
      </div>
    </div>
  );
}
