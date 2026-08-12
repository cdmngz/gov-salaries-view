import assert from "node:assert/strict";
import test from "node:test";

import { isRetryableBuildFailure } from "./build-with-retry.mjs";

test("recognizes retryable HTTP failures from prerender output", () => {
  assert.equal(
    isRetryableBuildFailure(
      'Error: fetchCountryData: data.json failed (503)\nExport encountered an error'
    ),
    true
  );
});

test("recognizes transient network failures", () => {
  assert.equal(isRetryableBuildFailure("TypeError: fetch failed"), true);
  assert.equal(isRetryableBuildFailure("cause: read ECONNRESET"), true);
});

test("does not retry application or permanent HTTP errors", () => {
  assert.equal(isRetryableBuildFailure("TypeError: value is not iterable"), false);
  assert.equal(isRetryableBuildFailure("data.json failed (404)"), false);
});
