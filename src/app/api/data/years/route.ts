// src/app/api/data/years/route.ts

import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env";

type YearsIndex = number[];
const isYearsIndex = (x: unknown): x is YearsIndex =>
  Array.isArray(x) && x.every((n) => Number.isInteger(n));

export async function GET() {
  const baseUrl = serverEnv.DATA_API_URL.replace(/\/$/, "");
  const url = `${baseUrl}/index.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch index" },
        { status: 500 }
      );
    }

    const json: unknown = await res.json();
    if (!isYearsIndex(json)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Failed to load years index:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
