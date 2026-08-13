import React from "react";

/**
 * Royal headwear is drawn last in the portrait so it stays visible above every
 * hair variant. The dark outlines keep the small details legible at 24px.
 */
export const accessoryVariants = {
  "king-crown": () => (
    <g data-avatar-accessory="king-crown">
      <path
        d="M14 6 22 14 28 4 35 13 42 4 48 14 56 6 52 23H18Z"
        fill="#f4c430"
        stroke="#8a5a00"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18 18H52L51 24H19Z"
        fill="#d99b16"
        stroke="#8a5a00"
        strokeWidth="1.5"
      />
      <circle cx="25" cy="20.5" r="2" fill="#b91c1c" />
      <circle cx="35" cy="20.5" r="2" fill="#2563eb" />
      <circle cx="45" cy="20.5" r="2" fill="#15803d" />
    </g>
  ),
  "princess-tiara": () => (
    <g data-avatar-accessory="princess-tiara">
      <path
        d="M17 21 23 11 30 18 35 7 40 18 47 11 53 21"
        fill="none"
        stroke="#d99b16"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 22Q35 26 52 22"
        fill="none"
        stroke="#8a5a00"
        strokeWidth="2"
      />
      <path
        d="m35 8 3 4-3 4-3-4Z"
        fill="#d9f2ff"
        stroke="#2563eb"
        strokeWidth="1"
      />
      <circle cx="23" cy="12" r="2" fill="#fff0f5" stroke="#b45374" />
      <circle cx="47" cy="12" r="2" fill="#fff0f5" stroke="#b45374" />
    </g>
  ),
} as const;
