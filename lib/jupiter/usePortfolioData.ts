"use client";

import { useCallback, useEffect, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import { useJupiterSession } from "@/lib/jupiter/useJupiterSession";
import { readApiError } from "@/lib/jupiter/apiError";
import { getReadonlyConnection, getSolBalance, getSplTokenBalance } from "@/lib/solana/balances";
import { SUPPORTED_ASSETS, USDC_DECIMALS, USDC_MINT, type XStockAsset } from "@/lib/jupiter/assets";
import type { DcaOrderHistoryItem, DcaOrderHistoryResponse, PriceResponse } from "@/lib/jupiter/types";

export interface AssetHolding {
  asset: XStockAsset;
  balance: number;
  priceUsd: number | null;
  stockData: PriceResponse[string]["stockData"] | null;
}

export interface PortfolioData {
  connected: boolean;
  authenticating: boolean;
  needsVerification: boolean;
  onConnect: () => void;
  onVerify: () => void;
  loading: boolean;
  error: string | null;
  rpcConfigured: boolean;
  holdings: AssetHolding[];
  usdcBalance: number | null;
  solBalance: number | null;
  activeOrders: DcaOrderHistoryItem[];
  pastOrders: DcaOrderHistoryItem[];
  totalInvestedUsd: number | null;
  currentValueUsd: number | null;
  totalRoundsFilled: number;
  refresh: () => void;
}

export function usePortfolioData(): PortfolioData {
  const { connected, address, login } = useSigner();
  const { token, authenticating, ensureToken, authedFetch } = useJupiterSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<AssetHolding[]>([]);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [activeOrders, setActiveOrders] = useState<DcaOrderHistoryItem[]>([]);
  const [pastOrders, setPastOrders] = useState<DcaOrderHistoryItem[]>([]);

  const rpcConfigured = getReadonlyConnection() !== null;

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      await ensureToken();

      const balancePromise = (async () => {
        const connection = getReadonlyConnection();
        if (!connection) return;
        const [assetBalances, usdc, sol] = await Promise.all([
          Promise.all(SUPPORTED_ASSETS.map((asset) => getSplTokenBalance(connection, address, asset.mint))),
          getSplTokenBalance(connection, address, USDC_MINT),
          getSolBalance(connection, address),
        ]);
        setHoldings((prev) =>
          SUPPORTED_ASSETS.map((asset, i) => ({
            asset,
            balance: assetBalances[i],
            priceUsd: prev.find((h) => h.asset.mint === asset.mint)?.priceUsd ?? null,
            stockData: prev.find((h) => h.asset.mint === asset.mint)?.stockData ?? null,
          }))
        );
        setUsdcBalance(usdc);
        setSolBalance(sol);
      })();

      const priceIds = SUPPORTED_ASSETS.map((asset) => asset.mint).join(",");
      const pricePromise = fetch(`/api/jupiter/price?ids=${priceIds}`)
        .then((res) => (res.ok ? (res.json() as Promise<PriceResponse>) : null))
        .then((data) => {
          setHoldings((prev) => {
            const base = prev.length
              ? prev
              : SUPPORTED_ASSETS.map((asset) => ({ asset, balance: 0, priceUsd: null, stockData: null }));
            return base.map((holding) => ({
              ...holding,
              priceUsd: data?.[holding.asset.mint]?.usdPrice ?? holding.priceUsd,
              stockData: data?.[holding.asset.mint]?.stockData ?? holding.stockData,
            }));
          });
        })
        .catch(() => undefined);

      const activeRes = await authedFetch("/api/jupiter/trigger/orders/dca/history?state=active");
      if (!activeRes.ok) throw new Error(await readApiError(activeRes, "Could not load active orders."));
      const active = (await activeRes.json()) as DcaOrderHistoryResponse;

      const pastRes = await authedFetch("/api/jupiter/trigger/orders/dca/history?state=past");
      if (!pastRes.ok) throw new Error(await readApiError(pastRes, "Could not load order history."));
      const past = (await pastRes.json()) as DcaOrderHistoryResponse;

      await Promise.all([balancePromise, pricePromise]);

      setActiveOrders(active.orders);
      setPastOrders(past.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your portfolio.");
    } finally {
      setLoading(false);
    }
  }, [address, ensureToken, authedFetch]);

  useEffect(() => {
    if (connected && token) {
      void Promise.resolve().then(() => load());
    }
  }, [connected, token, load]);

  const allOrders = [...activeOrders, ...pastOrders];
  const totalInvestedUsd = allOrders.length
    ? allOrders.reduce((sum, o) => sum + Number(o.inputAmountUsed) / 10 ** USDC_DECIMALS, 0)
    : null;
  const currentValueUsd = holdings.length
    ? holdings.reduce((sum, h) => sum + (h.priceUsd !== null ? h.balance * h.priceUsd : 0), 0)
    : null;
  const totalRoundsFilled = allOrders.reduce((sum, o) => sum + o.roundsFilled, 0);

  return {
    connected,
    authenticating,
    needsVerification: connected && !token,
    onConnect: login,
    onVerify: load,
    loading,
    error,
    rpcConfigured,
    holdings,
    usdcBalance,
    solBalance,
    activeOrders,
    pastOrders,
    totalInvestedUsd,
    currentValueUsd,
    totalRoundsFilled,
    refresh: load,
  };
}
