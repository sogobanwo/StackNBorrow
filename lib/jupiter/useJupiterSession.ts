"use client";

import { useCallback, useRef, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import { readApiError } from "@/lib/jupiter/apiError";
import { withTimeout } from "@/lib/timeout";
import type { AuthChallengeResponse, AuthVerifyResponse } from "@/lib/jupiter/types";

const TOKEN_TTL_MS = 23 * 60 * 60 * 1000; // refresh a little before the real 24h expiry
const SIGN_MESSAGE_TIMEOUT_MS = 60000; // generous — a human has to notice and approve the wallet popup
const FETCH_TIMEOUT_MS = 25000;

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
  /** Registers this wallet's Trigger V2 vault on first use — required before any deposit/order call. */
  ensureVault: () => Promise<void>;
}

export function useJupiterSession(): JupiterSession {
  const { address, signMessage } = useSigner();
  const [token, setToken] = useState<string | null>(() => (address ? readStoredToken(address) : null));
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const vaultEnsuredForAddress = useRef<string | null>(null);

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
      const challengeRes = await withTimeout(
        fetch("/api/jupiter/trigger/auth/challenge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ walletPubkey: address }),
        }),
        FETCH_TIMEOUT_MS,
        "Timed out starting wallet verification. Try again."
      );
      if (!challengeRes.ok) {
        throw new Error(await readApiError(challengeRes, "Could not start wallet verification. Try again."));
      }
      const { challenge } = (await challengeRes.json()) as AuthChallengeResponse;

      let signature: string;
      try {
        signature = await withTimeout(
          signMessage(challenge),
          SIGN_MESSAGE_TIMEOUT_MS,
          "Signature request timed out — check your wallet for a pending prompt."
        );
      } catch (signError) {
        if (signError instanceof Error && signError.message.includes("timed out")) throw signError;
        throw new Error("Signature request was rejected.");
      }

      const verifyRes = await withTimeout(
        fetch("/api/jupiter/trigger/auth/verify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ walletPubkey: address, signature }),
        }),
        FETCH_TIMEOUT_MS,
        "Timed out verifying your wallet. Try again."
      );
      if (!verifyRes.ok) {
        throw new Error(await readApiError(verifyRes, "Wallet verification failed. Try again."));
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

  /**
   * A fresh wallet has no Trigger V2 vault yet — deposit/order calls fail with
   * "No vault registered for this user" until one is registered. Per Jupiter's docs this is a
   * plain API call (GET /trigger/v2/vault/register), not a transaction to sign.
   */
  const ensureVault = useCallback(async (): Promise<void> => {
    if (!address) {
      throw new Error("Connect your wallet first");
    }
    if (vaultEnsuredForAddress.current === address) return;

    const token = await ensureToken();
    const checkRes = await withTimeout(
      fetch("/api/jupiter/trigger/vault", { headers: { Authorization: `Bearer ${token}` } }),
      FETCH_TIMEOUT_MS,
      "Timed out checking your Trigger vault. Try again."
    );
    if (checkRes.ok) {
      vaultEnsuredForAddress.current = address;
      return;
    }

    const registerRes = await withTimeout(
      fetch("/api/jupiter/trigger/vault?register=true", { headers: { Authorization: `Bearer ${token}` } }),
      FETCH_TIMEOUT_MS,
      "Timed out setting up your Trigger vault. Try again."
    );
    if (!registerRes.ok && registerRes.status !== 409) {
      throw new Error(await readApiError(registerRes, "Could not set up your Jupiter Trigger vault. Try again."));
    }
    vaultEnsuredForAddress.current = address;
  }, [address, ensureToken]);

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

  return { token, authenticating, authError, ensureToken, authedFetch, ensureVault };
}
