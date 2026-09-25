const JUPITER_BASE = "https://api.jup.ag";
const JUPITER_TIMEOUT_MS = 20000;

function requireApiKey(): string {
  const key = process.env.JUPITER_API_KEY;
  if (!key) {
    throw new Error("JUPITER_API_KEY is not set on the server");
  }
  return key;
}

/** Server-only fetch wrapper: attaches the Jupiter API key and, when given, the per-user Trigger JWT. */
export async function jupiterFetch(
  path: string,
  init: RequestInit & { bearerToken?: string } = {}
): Promise<Response> {
  const { bearerToken, headers, signal, ...rest } = init;
  try {
    return await fetch(`${JUPITER_BASE}${path}`, {
      ...rest,
      signal: signal ?? AbortSignal.timeout(JUPITER_TIMEOUT_MS),
      headers: {
        "x-api-key": requireApiKey(),
        "content-type": "application/json",
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...headers,
      },
    });
  } catch (error) {
    // fetch() rejects with a raw DOMException on timeout/network failure, whose `message` property
    // has no setter — letting it propagate trips a Node/Next.js dev-mode bug ("Cannot set property
    // message of ... which has only a getter") when error handling tries to enrich it, crashing the
    // request instead of surfacing the real failure. Converting to a plain Response here means every
    // route's existing `if (!res.ok)` handling already covers it, with no per-route change needed.
    const name = (error as { name?: string } | null)?.name;
    const isTimeout = name === "TimeoutError" || name === "AbortError";
    const detail = error instanceof Error ? error.message : String(error);
    const message = isTimeout
      ? `Jupiter API request timed out after ${JUPITER_TIMEOUT_MS}ms`
      : `Jupiter API request failed: ${detail}`;
    return new Response(message, { status: isTimeout ? 504 : 502 });
  }
}

/** Reads "Bearer <token>" from an incoming request's Authorization header, or null. */
export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}
