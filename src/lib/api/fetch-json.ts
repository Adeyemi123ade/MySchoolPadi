export class ApiFetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * fetch() wrapper for client components: parses the { data } / { error }
 * envelope and throws ApiFetchError (with status) on failure, so callers can
 * distinguish retryable (5xx/network) from non-retryable (4xx) failures.
 * Also normalizes failures the server never gets a chance to shape into a
 * friendly message — a dropped connection (fetch() itself rejects) or a
 * non-JSON response (res.json() throws) would otherwise surface the raw
 * browser/parser error text (e.g. "Failed to fetch") straight to the user.
 */
export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(input, init);
  } catch {
    throw new ApiFetchError("You appear to be offline. Please check your connection and try again.", 0);
  }

  let json: { data?: T; error?: { message?: string } };
  try {
    json = await res.json();
  } catch {
    throw new ApiFetchError("We couldn't complete that. Please try again.", res.status);
  }

  if (!res.ok) {
    throw new ApiFetchError(json.error?.message ?? "We couldn't complete that. Please try again.", res.status);
  }

  return json.data as T;
}
