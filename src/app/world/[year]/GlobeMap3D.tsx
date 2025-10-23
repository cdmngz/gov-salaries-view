"use client";

import * as React from "react";
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
  stroke = "#CDE",
  lang,
  onCountryClick,
}: {
  data: DataShape;
  className?: string;
  ocean?: string;
  stroke?: string;
  lang: Language;
  onCountryClick?: (p: { iso_a2?: string; name?: string; wing?: Wing }) => void;
}) {
  const byIso2 = React.useMemo(() => buildIso2Map(data, lang), [data, lang]);

  const [rotation, setRotation] = React.useState<[number, number, number]>([
    0, -10, 0,
  ]);
  const dragging = React.useRef(false);
  const last = React.useRef<{ x: number; y: number } | null>(null);

  const [scale, setScale] = React.useState(240);
  const MIN_SCALE = 140;
  const MAX_SCALE = 800;

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setRotation((r) => [r[0] + dx * 0.4, r[1] - dy * 0.4, 0]);
  }
  function onPointerUp(e: React.PointerEvent) {
    dragging.current = false;
    last.current = null;
    (e.target as Element).releasePointerCapture(e.pointerId);
  }

  function zoomBy(f: number) {
    setScale((s) =>
      Math.max(MIN_SCALE, Math.min(MAX_SCALE, Math.round(s * f)))
    );
  }
  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const f = e.deltaY > 0 ? 1 / 1.1 : 1.1;
    zoomBy(f);
  }
  function onDoubleClick() {
    zoomBy(1.25);
  }

  return (
    <div
      className={cn(
        "border-none bg-card p-3 shadow-none rounded-none",
        className
      )}
    >
      <div className="mb-2 flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Zoom in"
          className="rounded-md border px-2 py-1 text-sm hover:bg-accent"
          onClick={() => zoomBy(1.2)}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          className="rounded-md border px-2 py-1 text-sm hover:bg-accent"
          onClick={() => zoomBy(1 / 1.2)}
        >
          -
        </button>
        <button
          type="button"
          aria-label="Reset view"
          className="rounded-md border px-2 py-1 text-sm hover:bg-accent"
          onClick={() => {
            setScale(240);
            setRotation([0, -10, 0]);
          }}
        >
          Reset
        </button>
      </div>

      <TooltipProvider delayDuration={150}>
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ rotate: rotation, scale }}
          style={{ width: "100%", height: "auto", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onWheel={onWheel}
          onDoubleClick={onDoubleClick}
        >
          <Sphere
            id="globe-sphere"
            fill={ocean}
            stroke="#0ea5e9"
            strokeWidth={0}
          />
          <Graticule stroke="#93c5fd" strokeOpacity={0.35} />

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
                              cursor: "grab",
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
  );
}
