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
  return fetch(`${JUPITER_BASE}${path}`, {
    ...rest,
    signal: signal ?? AbortSignal.timeout(JUPITER_TIMEOUT_MS),
    headers: {
      "x-api-key": requireApiKey(),
      "content-type": "application/json",
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
      ...headers,
    },
  });
}

/** Reads "Bearer <token>" from an incoming request's Authorization header, or null. */
export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}
