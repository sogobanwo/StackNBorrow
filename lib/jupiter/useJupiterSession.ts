"use client";

import { useCallback, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import type { AuthChallengeResponse, AuthVerifyResponse } from "@/lib/jupiter/types";

const TOKEN_TTL_MS = 23 * 60 * 60 * 1000; // refresh a little before the real 24h expiry

interface StoredToken {
  token: string;
  issuedAt: number;
}

function storageKey(address: string): string {
  return `jupiter-trigger-token:${address}`;
}

function readStoredToken(address: string): string | null {
  try {
    const raw = sessionStorage.getItem(storageKey(address));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredToken;
    if (Date.now() - parsed.issuedAt > TOKEN_TTL_MS) return null;
    return parsed.token;
  } catch {
    return null;
  }
}

function writeStoredToken(address: string, token: string): void {
  try {
    const entry: StoredToken = { token, issuedAt: Date.now() };
    sessionStorage.setItem(storageKey(address), JSON.stringify(entry));
  } catch {
    // sessionStorage unavailable (private mode) — token still works for this render
  }
}

export interface JupiterSession {
  /** Non-null once this wallet has a cached (or freshly issued) Jupiter Trigger JWT — safe to auto-fetch with. */
  token: string | null;
  authenticating: boolean;
  authError: string | null;
  /** Returns a valid Jupiter Trigger JWT, running the challenge/verify flow if needed. */
  ensureToken: () => Promise<string>;
  /** Fetch one of our /api/jupiter/trigger/* routes with the bearer token attached. */
  authedFetch: (path: string, init?: RequestInit) => Promise<Response>;
}

export function useJupiterSession(): JupiterSession {
  const { address, signMessage } = useSigner();
  const [token, setToken] = useState<string | null>(() => (address ? readStoredToken(address) : null));
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [tokenForAddress, setTokenForAddress] = useState(address);
  if (address !== tokenForAddress) {
    setTokenForAddress(address);
    setToken(address ? readStoredToken(address) : null);
  }

  const ensureToken = useCallback(async (): Promise<string> => {
    if (!address) {
      throw new Error("Connect your wallet first");
    }

    const cached = readStoredToken(address);
    if (cached) {
      setToken(cached);
      return cached;
    }

    setAuthenticating(true);
    setAuthError(null);
    try {
      const challengeRes = await fetch("/api/jupiter/trigger/auth/challenge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ walletPubkey: address }),
      });
      if (!challengeRes.ok) {
        throw new Error("Could not start wallet verification. Try again.");
      }
      const { challenge } = (await challengeRes.json()) as AuthChallengeResponse;

      let signedChallenge: string;
      try {
        signedChallenge = await signMessage(challenge);
      } catch {
        throw new Error("Signature request was rejected.");
      }

      const verifyRes = await fetch("/api/jupiter/trigger/auth/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ walletPubkey: address, signedChallenge }),
      });
      if (!verifyRes.ok) {
        throw new Error("Wallet verification failed. Try again.");
      }
      const { token: newToken } = (await verifyRes.json()) as AuthVerifyResponse;

      writeStoredToken(address, newToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet verification failed.";
      setAuthError(message);
      throw error;
    } finally {
      setAuthenticating(false);
    }
  }, [address, signMessage]);

  const authedFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const token = await ensureToken();
      return fetch(path, {
        ...init,
        headers: {
          ...(init.body ? { "content-type": "application/json" } : {}),
          Authorization: `Bearer ${token}`,
          ...init.headers,
        },
      });
    },
    [ensureToken]
  );

  return { token, authenticating, authError, ensureToken, authedFetch };
}
