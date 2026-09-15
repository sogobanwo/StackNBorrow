export async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) return body.error;
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return fallback;
}
