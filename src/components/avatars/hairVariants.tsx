// src/components/avatars/hairVariants.tsx

import React from "react";

type HairProps = {
  fill?: string;
};

/**
 * Hair silhouettes are drawn for the 70 x 100 portrait view box. Each style
 * deliberately leaves the centre of the face clear and uses a small highlight
 * so it remains readable at the compact size used in official lists.
 */
export const hairVariants = {
  hair1: ({ fill = "#6b3f2a" }: HairProps) => (
    <g>
      <path
        d="M10 31C10 12 20 4 35 4c16 0 25 10 25 27v8l-5-4-2-15c-7 3-15 3-23-1-4 5-8 8-13 10l-2 11-5-4z"
        fill={fill}
      />
      <path d="M18 18c8-9 23-11 34-3-12-3-22-1-30 6z" fill="#fff" opacity=".16" />
    </g>
  ),
  hair2: ({ fill = "#3f2a22" }: HairProps) => (
    <g>
      <path
        d="M9 32C9 13 19 4 35 4s26 10 26 28l-2 18-7 8 2-29c-5-7-11-11-20-11-8 0-14 4-19 12l3 28-8-8z"
        fill={fill}
      />
      <path d="M15 22C22 8 42 5 54 17 40 12 28 14 18 27z" fill="#fff" opacity=".14" />
    </g>
  ),
  hair3: ({ fill = "#8b6845" }: HairProps) => (
    <g>
      <path
        d="M8 31C8 12 20 3 36 3c17 0 26 12 26 30l-2 32-9 7 3-39c-2-9-8-14-17-16-10 0-17 5-21 15l3 40-9-7z"
        fill={fill}
      />
      <path d="M14 29C18 10 34 6 49 13c-11 0-20 4-27 13l-6 12z" fill={fill} />
      <path d="M19 18c7-9 20-11 30-5-11-1-20 3-27 11z" fill="#fff" opacity=".17" />
    </g>
  ),
  hair4: ({ fill = "#70401f" }: HairProps) => (
    <g fill={fill}>
      <path d="M10 34C7 17 17 5 34 4c18-1 29 11 27 30l-4 15-5-17c-2-9-9-14-18-14-10 0-16 6-18 16l-3 15z" />
      <circle cx="16" cy="20" r="7" />
      <circle cx="25" cy="11" r="8" />
      <circle cx="37" cy="10" r="8" />
      <circle cx="49" cy="13" r="8" />
      <circle cx="56" cy="23" r="7" />
      <path d="M18 17c8-8 22-10 33-2" fill="none" stroke="#fff" strokeWidth="2" opacity=".16" />
    </g>
  ),
  hair5: ({ fill = "#45413f" }: HairProps) => (
    <g>
      <path
        d="M11 31C11 14 20 5 35 5c16 0 25 9 25 26l-2 10-5-5-1-15c-9 2-19 0-27-5-2 5-6 9-10 12v10l-4 4z"
        fill={fill}
      />
      <path d="M18 16c9-8 24-8 34 0-13-3-24-1-32 5z" fill="#fff" opacity=".18" />
      <path d="M25 16c6 5 16 7 27 5" fill="none" stroke="#000" strokeWidth="1.5" opacity=".12" />
    </g>
  ),
  hair6: ({ fill = "#24201f" }: HairProps) => (
    <g>
      <path
        d="M10 34c0-10 3-18 10-23l-3-7 10 4 5-8 5 8 9-7-1 9 11-4-5 9c6 5 9 12 9 21l-3 7-5-7-1-15c-8 3-18 2-27-4-2 6-5 10-9 13v8l-5 5z"
        fill={fill}
      />
      <path d="M21 13c9-6 22-5 31 2-11-3-21-1-29 4z" fill="#fff" opacity=".17" />
    </g>
  ),
} as const;
