// src/components/Portrait.tsx

import React, { ReactNode } from "react";
import { accessoryVariants } from "./avatars/accessoryVariants";
import { clothesVariants } from "./avatars/clothesVariants";
import { hairVariants } from "./avatars/hairVariants";
import { components } from "@/types/openapi";

type Official = components["schemas"]["Official"];

type AvatarDefinition = {
  hair: (props: { fill?: string }) => ReactNode;
  clothes: (props: { fill?: string; accentColor?: string }) => ReactNode;
  accessory?: () => ReactNode;
};

function roleTag(
  role?: string,
): "royalty" | "head" | "deputy" | "minister" | "default" {
  const normalized = (role ?? "").toLowerCase();
  if (/\b(king|queen|monarch|royal|prince|princess)\b/.test(normalized))
    return "royalty";
  if (/\b(president|prime minister|chancellor|governor)\b/.test(normalized))
    return "head";
  if (/\b(deputy|vice|speaker|spokesperson)\b/.test(normalized))
    return "deputy";
  if (/\bminister\b/.test(normalized)) return "minister";
  return "default";
}

function ribbonAccessory() {
  return (
    <path
      d="M18 48 Q35 38 52 48"
      stroke="#cf2f2f"
      strokeWidth="3"
      fill="none"
    />
  );
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

type HairVariant = keyof typeof hairVariants;

const pickHairVariant = (official: Official): HairVariant => {
  const variants: HairVariant[] =
    official.gender === "F"
      ? ["hair2", "hair3", "hair4"]
      : official.gender === "M"
        ? ["hair1", "hair5", "hair6"]
        : ["hair1", "hair2", "hair3", "hair4", "hair5", "hair6"];
  const seed = Array.from(official.name ?? "").reduce(
    (total, character) => total + (character.codePointAt(0) ?? 0),
    0,
  );

  return variants[seed % variants.length];
};

const generateAvatar = (
  official: Official,
  color?: string,
): AvatarDefinition => {
  if (official.name === "Javier Milei" && official.party === "LLA") {
    return {
      hair: (props) => hairVariants["hair6"]({ ...props }),
      clothes: (props) =>
        clothesVariants["clothes-formal"]({
          ...props,
          fill: color ?? "#333",
        }),
    };
  }

  const isFemale = official.gender === "F";
  const palette = genderPalette(official.gender);
  const roleType = roleTag(official.role);
  const hairVariant = pickHairVariant(official);

  const partyColor = color || undefined;
  const suitColor = (() => {
    // Party colors apply to every female outfit, including royal gowns.
    if (isFemale) return partyColor ?? palette.accent;
    if (roleType === "royalty") return partyColor ?? "#6f1d45";
    if (roleType === "deputy") return "#3c4b63";
    return partyColor ?? "#333";
  })();

  const accessory = (() => {
    if (roleType === "royalty") {
      return isFemale
        ? accessoryVariants["princess-tiara"]
        : accessoryVariants["king-crown"];
    }
    if (roleType === "deputy") return ribbonAccessory;
    return undefined;
  })();

  return {
    hair: (props) =>
      hairVariants[hairVariant]({ ...props, fill: palette.hair }),
    clothes: (props) =>
      clothesVariants[
        roleType === "royalty"
          ? "clothes-royal"
          : isFemale
            ? "clothes-blouse"
            : "clothes-formal"
      ]({
        ...props,
        fill: suitColor,
        accentColor: isFemale ? "#fff7fb" : props.accentColor,
      }),
    accessory,
  };
};

export default function Portrait({
  official,
  parties,
}: {
  official: Official;
  parties?: components["schemas"]["Parties"];
}) {
  const size = 24;
  const palette = genderPalette(official.gender);
  const isFemale = official.gender === "F";

  const {
    hair: Hair,
    clothes: Clothes,
    accessory: Accessory,
  } = generateAvatar(official, parties?.[official.party ?? ""]?.color);

  return (
    <svg
      viewBox="0 0 70 100"
      width={size}
      height={size}
      role="img"
      aria-label={`${official.name} avatar`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <circle cx="35" cy="30" r="25" fill={palette.skin} />
      {isFemale ? (
        <>
          <circle cx="18" cy="34" r="2" fill={palette.accent} />
          <circle cx="52" cy="34" r="2" fill={palette.accent} />
          <path
            d="M28 46 Q35 50 42 46"
            stroke={palette.accent}
            strokeWidth="2"
            fill="none"
          />
        </>
      ) : (
        <path
          d="M27 43 Q35 46 43 43"
          stroke="#7a4a36"
          strokeWidth="1.5"
          fill="none"
        />
      )}
      <Hair />
      {Accessory ? <Accessory /> : null}
      <Clothes />
    </svg>
  );
}
