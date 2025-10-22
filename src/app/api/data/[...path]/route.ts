// src/app/api/data/[...path]/route.ts

import type { NextRequest } from "next/server";

import { serverEnv } from "@/lib/env";

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/data/[...path]">
) {
  const { path } = await ctx.params;

  const url = [serverEnv["DATA_API_URL"], ...path].join("/");

  const res = await fetch(url, request);
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
