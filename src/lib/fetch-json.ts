const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);

type FetchJsonOptions = {
  attempts?: number;
  baseDelayMs?: number;
};

const wait = (delayMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, delayMs));

export async function fetchJson<T>(
  url: string,
  errorContext: string,
  { attempts = 3, baseDelayMs = 250 }: FetchJsonOptions = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) return (await response.json()) as T;

      const error = new Error(`${errorContext} (${response.status})`);
      if (!RETRYABLE_STATUSES.has(response.status) || attempt === attempts) {
        throw error;
      }
      lastError = error;
    } catch (error) {
      lastError = error;
      if (
        attempt === attempts ||
        (error instanceof Error && /\(\d{3}\)$/.test(error.message))
      ) {
        throw error;
      }
    }

    await wait(baseDelayMs * 2 ** (attempt - 1));
  }

  throw lastError;
}
