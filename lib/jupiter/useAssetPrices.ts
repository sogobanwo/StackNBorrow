"use client";

import { useEffect, useState } from "react";
import { SUPPORTED_ASSETS, type XStockAsset } from "@/lib/jupiter/assets";
import type { PriceResponse } from "@/lib/jupiter/types";

export type AssetPrices = Record<string, number>; // mint -> usdPrice

/** Live USD prices for the given assets (defaults to all supported xStocks) — one shared fetch, no wallet/auth needed. */
export function useAssetPrices(assets: readonly XStockAsset[] = SUPPORTED_ASSETS): {
  prices: AssetPrices;
  loading: boolean;
} {
  const [prices, setPrices] = useState<AssetPrices>({});
  const [loading, setLoading] = useState(true);
  const ids = assets.map((asset) => asset.mint).join(",");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/jupiter/price?ids=${ids}`)
      .then((res) => (res.ok ? (res.json() as Promise<PriceResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const next: AssetPrices = {};
        for (const id of ids.split(",")) {
          const price = data[id]?.usdPrice;
          if (price !== undefined) next[id] = price;
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
  }, [ids]);

  return { prices, loading };
}
