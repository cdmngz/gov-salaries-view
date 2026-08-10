import React from "react";

type ClothesProps = {
  fill?: string;
  accentColor?: string;
};

export const clothesVariants = {
  "clothes-formal": ({ fill = "#4682b4" }: ClothesProps) => (
    <g>
      <rect x="5" y="40" width="60" height="50" rx="8" fill="#383838" />
      <rect x="20" y="40" width="30" height="40" rx="8" fill="#fff" />
      <rect x="32" y="42" width="7" height="30" rx="8" fill={fill} />
    </g>
  ),
  "clothes-blouse": ({
    fill = "#c85a7b",
    accentColor = "#fff7fb",
  }: ClothesProps) => (
    <g>
      <path
        d="M8 90 V57 Q8 43 24 40 L35 52 L46 40 Q62 43 62 57 V90 Z"
        fill={fill}
      />
      <path
        d="M24 40 Q25 53 35 58 Q45 53 46 40 L40 39 Q35 45 30 39 Z"
        fill={accentColor}
      />
      <path
        d="M35 58 V90"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="1.5"
      />
      <circle cx="35" cy="65" r="1.4" fill={accentColor} />
      <circle cx="35" cy="73" r="1.4" fill={accentColor} />
    </g>
  ),
} as const;
