"use client";

import { useEffect, useState } from "react";
import { SUPPORTED_ASSETS } from "@/lib/jupiter/assets";
import type { PriceResponse } from "@/lib/jupiter/types";

export type AssetPrices = Record<string, number>; // mint -> usdPrice

/** Live USD prices for all supported xStocks — one shared fetch, no wallet/auth needed. */
export function useAssetPrices(): { prices: AssetPrices; loading: boolean } {
  const [prices, setPrices] = useState<AssetPrices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const ids = SUPPORTED_ASSETS.map((asset) => asset.mint).join(",");
    fetch(`/api/jupiter/price?ids=${ids}`)
      .then((res) => (res.ok ? (res.json() as Promise<PriceResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const next: AssetPrices = {};
        for (const asset of SUPPORTED_ASSETS) {
          const price = data[asset.mint]?.usdPrice;
          if (price !== undefined) next[asset.mint] = price;
        }
        setPrices(next);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { prices, loading };
}
