"use client";

import { useEffect, useState } from "react";
import { PYTH_EQUITY_FEED_BY_MINT } from "@/lib/pyth/feeds";
import type { PythPriceResponse } from "@/lib/pyth/types";

export type EquityPrices = Record<string, number>; // mint -> real-world equity/ETF USD price

export interface PythPricesState {
  prices: EquityPrices;
  loading: boolean;
  error: string | null;
}

/** Live real-world equity prices (via Pyth) for the xStock mints that have a Pyth feed. */
export function usePythPrices(): PythPricesState {
  const [prices, setPrices] = useState<EquityPrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const entries = Object.entries(PYTH_EQUITY_FEED_BY_MINT);
    const ids = entries.map(([, feed]) => feed.feedId).join(",");

    fetch(`/api/pyth/price?ids=${ids}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error ?? `Pyth price request failed (${res.status})`);
        }
        return res.json() as Promise<PythPriceResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        const next: EquityPrices = {};
        for (const [mint, feed] of entries) {
          const price = data[feed.feedId]?.usdPrice;
          if (price !== undefined) next[mint] = price;
        }
        setPrices(next);
        setError(null);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load Pyth prices.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { prices, loading, error };
}
