// src/components/Portrait.tsx

import React, { ReactNode } from "react";
import { clothesVariants } from "./avatars/clothesVariants";
import { hairVariants } from "./avatars/hairVariants";
import { components } from "@/types/openapi";

const generateAvatar = (
  official: components["schemas"]["Official"],
  color = "#333"
): {
  hair: (props: { fill?: string }) => ReactNode;
  clothes: (props: { fill?: string; accentColor?: string }) => ReactNode;
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
  official: components["schemas"]["Official"];
  parties?: components["schemas"]["Parties"];
}) {
  const size = 28;

  const { hair: Hair, clothes: Clothes } = generateAvatar(
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
      <circle cx="35" cy="30" r="25" fill="#ffe0bd" />
      <Hair />
      <Clothes />
    </svg>
  );
}
