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
  "clothes-royal": ({
    fill = "#6f1d45",
    accentColor = "#f4c430",
  }: ClothesProps) => (
    <g>
      <path
        d="M6 90V58Q6 44 23 39L35 51 47 39Q64 44 64 58V90Z"
        fill={fill}
      />
      <path
        d="M23 39Q25 51 35 57Q45 51 47 39L41 38 35 47 29 38Z"
        fill="#fff8e7"
      />
      <path
        d="M10 58Q20 50 26 43M60 58Q50 50 44 43M35 57V90"
        fill="none"
        stroke={accentColor}
        strokeWidth="2.5"
      />
      <circle cx="35" cy="65" r="1.8" fill={accentColor} />
      <circle cx="35" cy="74" r="1.8" fill={accentColor} />
    </g>
  ),
} as const;
