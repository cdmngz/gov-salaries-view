// src/app/api/data/years/route.ts

import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";

export async function GET() {
  const baseUrl = serverEnv.DATA_API_URL.replace(/\/$/, "");
  const url = `${baseUrl}/index.json`;

  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch index" },
        { status: 500 }
      );
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("❌ Failed to load years index:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
