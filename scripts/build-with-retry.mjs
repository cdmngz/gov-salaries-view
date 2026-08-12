import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const RETRYABLE_HTTP_STATUSES = [408, 425, 429, 500, 502, 503, 504];
const DEFAULT_RETRIES = 2;
const DEFAULT_DELAY_MS = 15_000;
const MAX_CAPTURED_OUTPUT = 2 * 1024 * 1024;

export function isRetryableBuildFailure(output) {
  const statusPattern = RETRYABLE_HTTP_STATUSES.join("|");
  const transientFailure = new RegExp(
    `(?:\\((?:${statusPattern})\\)|(?:HTTP|status|responded(?: with)?)\\s*[:=]?\\s*(?:${statusPattern})\\b|ECONNRESET|ECONNREFUSED|EAI_AGAIN|ETIMEDOUT|UND_ERR_[A-Z_]+|fetch failed|socket hang up)`,
    "i"
  );

  return transientFailure.test(output);
}

function readNonNegativeInteger(name, fallback) {
  const rawValue = process.env[name];
  if (rawValue === undefined) return fallback;

  const value = Number(rawValue);
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer`);
  }
  return value;
}

function runNextBuild() {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

  return new Promise((resolve, reject) => {
    const child = spawn(command, ["run", "build:next"], {
      env: process.env,
      stdio: ["inherit", "pipe", "pipe"],
    });
    let output = "";

    const forward = (stream, destination) => {
      stream.on("data", (chunk) => {
        destination.write(chunk);
        output = (output + chunk.toString()).slice(-MAX_CAPTURED_OUTPUT);
      });
    };

    forward(child.stdout, process.stdout);
    forward(child.stderr, process.stderr);
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({ code, signal, output }));
  });
}

const wait = (delayMs) =>
  new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });

export async function runBuildWithRetry() {
  const retries = readNonNegativeInteger("BUILD_RETRIES", DEFAULT_RETRIES);
  const delayMs = readNonNegativeInteger(
    "BUILD_RETRY_DELAY_MS",
    DEFAULT_DELAY_MS
  );

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const result = await runNextBuild();
    if (result.code === 0) return;

    const hasRetry = attempt < retries;
    if (!hasRetry || !isRetryableBuildFailure(result.output)) {
      if (result.signal) {
        throw new Error(`Next.js build terminated by signal ${result.signal}`);
      }
      process.exitCode = result.code ?? 1;
      return;
    }

    const nextAttempt = attempt + 2;
    process.stderr.write(
      `\nTransient data-source failure detected. Retrying the complete build in ${delayMs}ms (${nextAttempt}/${retries + 1})...\n\n`
    );
    await wait(delayMs);
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await runBuildWithRetry();
}
