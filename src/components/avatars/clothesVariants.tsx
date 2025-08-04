import React from "react";

type ClothesProps = {
  fill?: string;
};

export const clothesVariants = {
  "clothes-formal": ({ fill = "#4682b4" }: ClothesProps) => (
    <g>
      <rect x="5" y="40" width="60" height="50" rx="8" fill="#383838" />
      <rect x="20" y="40" width="30" height="40" rx="8" fill="#fff" />
      <rect x="32" y="42" width="7" height="30" rx="8" fill={fill} />
    </g>
  ),
} as const;

export type ClothesVariant = keyof typeof clothesVariants;
