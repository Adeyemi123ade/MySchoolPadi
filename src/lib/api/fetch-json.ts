export class ApiFetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * fetch() wrapper for client components: parses the { data } / { error } envelope
 * and throws ApiFetchError (with status) on failure, so callers can distinguish
 * retryable (5xx/network) from non-retryable (4xx) failures.
 *
 * Defaults to `cache: "no-store"` — every route here is per-user and session-scoped,
 * so a browser-cached GET response (e.g. served instead of hitting the network on a
 * poll-driven refetch) would silently show stale data. Callers can still override it.
 */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, { cache: "no-store", ...init });
  const json = await res.json();

  if (!res.ok) {
    throw new ApiFetchError(json.error?.message ?? "Request failed", res.status);
  }

  return json.data as T;
}
