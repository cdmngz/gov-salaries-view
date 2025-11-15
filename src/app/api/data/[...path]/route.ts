// src/app/api/data/[...path]/route.ts

import type { NextRequest } from "next/server";

import { serverEnv } from "@/lib/env";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const url = [serverEnv.DATA_API_URL!, ...params.path].join("/");
  const res = await fetch(url, request);
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
