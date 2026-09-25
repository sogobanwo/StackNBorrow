export async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    if (typeof body.error === "string" && body.error.trim()) return friendlyTransactionError(body.error);
  } catch {
    // response wasn't JSON — fall through to the generic message
  }
  return fallback;
}

/**
 * Jupiter rejects a signed transaction whose accounts no longer match what it originally crafted —
 * per Jupiter's own docs, the most common cause is a wallet auto-injecting an extra instruction
 * (typically a priority fee) before signing, which we have no way to prevent from the dApp side.
 * Rewrite that specific failure into guidance the user can act on instead of the raw validation string.
 */
function friendlyTransactionError(message: string): string {
  if (/accounts modified/i.test(message)) {
    return "Your wallet changed this transaction before signing it — usually an automatic priority fee. Turn off automatic/dynamic priority fees in your wallet's settings, then try again.";
  }
  return message;
}
