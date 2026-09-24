const HERMES_BASE = "https://hermes.pyth.network";
const HERMES_TIMEOUT_MS = 20000;

function requireApiKey(): string {
  const key = process.env.PYTH_API_KEY;
  if (!key) {
    throw new Error("PYTH_API_KEY is not set on the server");
  }
  return key;
}

/** Server-only fetch wrapper: attaches the Pyth Hermes API key. */
export async function hermesFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const { headers, signal, ...rest } = init;
  return fetch(`${HERMES_BASE}${path}`, {
    ...rest,
    signal: signal ?? AbortSignal.timeout(HERMES_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      ...headers,
    },
  });
}
