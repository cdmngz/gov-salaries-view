// src/components/Portrait.tsx

import React, { ReactNode } from "react";
import { clothesVariants } from "./avatars/clothesVariants";
import { hairVariants } from "./avatars/hairVariants";
import { components } from "@/types/openapi";

type Official = components["schemas"]["Official"];

type AvatarDefinition = {
  hair: (props: { fill?: string }) => ReactNode;
  clothes: (props: { fill?: string; accentColor?: string }) => ReactNode;
  accessory?: () => ReactNode;
};

function roleTag(role?: string): "royalty" | "head" | "deputy" | "minister" | "default" {
  const normalized = (role ?? "").toLowerCase();
  if (/(king|queen|monarch|royal|prince|princess)/.test(normalized)) return "royalty";
  if (/(president|prime minister|chancellor|governor)/.test(normalized)) return "head";
  if (/(deputy|vice|speaker|spokesperson)/.test(normalized)) return "deputy";
  if (/minister/.test(normalized)) return "minister";
  return "default";
}

function crownAccessory() {
  return (
    <g>
      <path d="M15 14 L23 6 L35 15 L47 6 L55 14 L52 22 L18 22 Z" fill="#f4c430" />
      <circle cx="23" cy="8" r="2" fill="#f7e08b" />
      <circle cx="35" cy="10" r="2" fill="#f7e08b" />
      <circle cx="47" cy="8" r="2" fill="#f7e08b" />
    </g>
  );
}

function ribbonAccessory() {
  return <path d="M18 48 Q35 38 52 48" stroke="#cf2f2f" strokeWidth="3" fill="none" />;
}

const genderPalette = (gender?: string) => {
  if (gender === "F") {
    return { hair: "#4a2a1a", skin: "#ffd9bf", accent: "#c85a7b" };
  }

  if (gender === "M") {
    return { hair: "#151515", skin: "#f3c7a6", accent: "#4361a8" };
  }

  return { hair: "#2f241f", skin: "#ffe0bd", accent: "#6b7280" };
};

const generateAvatar = (official: Official, color = "#333"): AvatarDefinition => {
  if (official.name === "Javier Milei" && official.party === "LLA") {
    return {
      hair: (props) => hairVariants["hair6"]({ ...props }),
      clothes: (props) => clothesVariants["clothes-formal"]({ ...props, fill: color }),
    };
  }

  const isFemale = official.gender === "F";
  const palette = genderPalette(official.gender);
  const roleType = roleTag(official.role);

  const hairVariant = (() => {
    if (roleType === "royalty") return isFemale ? "hair3" : "hair4";
    if (roleType === "deputy") return isFemale ? "hair3" : "hair5";
    if (roleType === "head") return isFemale ? "hair3" : "hair6";
    if (isFemale) return "hair4";
    if (official.gender === "M") return "hair5";
    return "hair6";
  })();

  const suitColor = (() => {
    if (roleType === "royalty") return "#5a3d0f";
    if (roleType === "deputy") return "#3c4b63";
    return isFemale ? palette.accent : color;
  })();

  const accessory = (() => {
    if (roleType === "royalty") return crownAccessory;
    if (roleType === "deputy") return ribbonAccessory;
    return undefined;
  })();

  return {
    hair: (props) => hairVariants[hairVariant]({ ...props, fill: palette.hair }),
    clothes: (props) =>
      clothesVariants[isFemale ? "clothes-blouse" : "clothes-formal"]({
        ...props,
        fill: suitColor,
        accentColor: isFemale ? "#fff7fb" : props.accentColor,
      }),
    accessory,
  };
};

export default function Portrait({ official, parties }: { official: Official; parties?: components["schemas"]["Parties"] }) {
  const size = 30;
  const palette = genderPalette(official.gender);
  const isFemale = official.gender === "F";

  const { hair: Hair, clothes: Clothes, accessory: Accessory } = generateAvatar(
    official,
    parties?.[official.party ?? ""]?.color
  );

  return (
    <svg
      viewBox="0 0 70 100"
      width={size}
      height={size}
      role="img"
      aria-label="Custom portrait"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="35" cy="30" r="25" fill={palette.skin} />
      {isFemale ? (
        <>
          <circle cx="18" cy="34" r="2" fill={palette.accent} />
          <circle cx="52" cy="34" r="2" fill={palette.accent} />
          <path d="M28 46 Q35 50 42 46" stroke={palette.accent} strokeWidth="2" fill="none" />
        </>
      ) : (
        <path d="M27 43 Q35 46 43 43" stroke="#7a4a36" strokeWidth="1.5" fill="none" />
      )}
      {Accessory ? <Accessory /> : null}
      <Hair />
      <Clothes />
    </svg>
  );
}
