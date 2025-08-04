// src/app/api/data/[...path]/route.ts

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const externalBase = process.env.DATA_API_URL!;
  const url = [externalBase, ...path].join("/");

  const res = await fetch(url, request);
  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
