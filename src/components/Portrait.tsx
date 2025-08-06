// src/components/Portrait.tsx

import React from "react";
import { Official, PartyMeta } from "@/types";
import { clothesVariants } from "./avatars/clothesVariants";
import { hairVariants } from "./avatars/hairVariants";

type ClothesProps = {
  fill?: string;
  accentColor?: string;
};

const generateAvatar = (
  official: Official,
  color = "#333"
): {
  hair: React.FC<{
    fill?: string;
  }>;
  clothes: React.FC<ClothesProps>;
} => {
  if (official.name === "Javier Milei" && official.party === "LLA") {
    return {
      hair: (props) => hairVariants["hair6"]({ ...props }),
      clothes: (props) =>
        clothesVariants["clothes-formal"]({
          ...props,
          fill: color,
        }),
    };
  }

  const hairVariant = (() => {
    if (official.gender === "M") return "hair5";
    if (official.gender === "F") return "hair3";
    return "hair6";
  })();

  return {
    hair: (props) => hairVariants[hairVariant]({ ...props, fill: "#121212" }),
    clothes: (props) =>
      clothesVariants["clothes-formal"]({
        ...props,
        fill: color,
      }),
  };
};

export default function Portrait({
  official,
  parties,
}: {
  official: Official;
  parties: Record<string, PartyMeta>;
}) {
  const size = 28;

  const { hair: Hair, clothes: Clothes } = generateAvatar(
    official,
    parties[official.party ?? ""]?.color
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
      <circle cx="35" cy="30" r="25" fill="#ffe0bd" />
      <Hair />
      <Clothes />
    </svg>
  );
}
