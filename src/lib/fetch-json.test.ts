// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchJson } from "./fetch-json";

describe("fetchJson", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("retries transient HTTP failures", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJson<{ ok: boolean }>("https://example.com/data.json", "data", {
        baseDelayMs: 0,
      })
    ).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not retry permanent HTTP failures", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJson("https://example.com/missing.json", "missing", {
        baseDelayMs: 0,
      })
    ).rejects.toThrow("missing (404)");
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("retries network errors and preserves the final error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError("network unavailable"))
      .mockRejectedValueOnce(new TypeError("network unavailable"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJson("https://example.com/data.json", "data", {
        attempts: 2,
        baseDelayMs: 0,
      })
    ).rejects.toThrow("network unavailable");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
