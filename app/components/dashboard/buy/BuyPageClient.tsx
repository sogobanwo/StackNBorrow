"use client";

import { useState } from "react";
import { AlertIcon, CheckIcon } from "@/app/components/icons";
import AssetSelector from "@/app/components/dashboard/AssetSelector";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import HoldingsTable from "@/app/components/dashboard/portfolio/HoldingsTable";
import { DEFAULT_ASSET, USDC_DECIMALS, USDC_MINT, type XStockAsset } from "@/lib/jupiter/assets";
import { readApiError } from "@/lib/jupiter/apiError";
import { simulateTransactionBase64 } from "@/lib/solana/simulate";
import { useSigner } from "@/lib/wallet/useSigner";
import { usePortfolioData } from "@/lib/jupiter/usePortfolioData";
import type { SwapExecuteResponse, SwapOrderResponse } from "@/lib/jupiter/types";

const DEFAULT_SLIPPAGE_BPS = 50; // 0.5% — a conservative default, not a Jupiter-mandated value

export default function BuyPageClient() {
  const { address, signTransaction } = useSigner();
  const data = usePortfolioData();
  const [asset, setAsset] = useState<XStockAsset>(DEFAULT_ASSET);
  const [amount, setAmount] = useState("10");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  async function handleBuy() {
    if (!data.connected || !address) {
      setError("Connect your wallet first.");
      return;
    }
    const usdcAmount = Number(amount);
    if (!Number.isFinite(usdcAmount) || usdcAmount <= 0) {
      setError("Enter a valid USDC amount.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSignature(null);

    const amountSmallestUnits = Math.round(usdcAmount * 10 ** USDC_DECIMALS).toString();

    try {
      const orderParams = new URLSearchParams({
        inputMint: USDC_MINT,
        outputMint: asset.mint,
        amount: amountSmallestUnits,
        taker: address,
        slippageBps: String(DEFAULT_SLIPPAGE_BPS),
      });
      const orderRes = await fetch(`/api/jupiter/swap/order?${orderParams.toString()}`);
      if (!orderRes.ok) {
        throw new Error(await readApiError(orderRes, "Could not get a swap quote."));
      }
      const order = (await orderRes.json()) as SwapOrderResponse;
      if (!order.transaction) {
        throw new Error(order.errorMessage ?? "No swap route available right now.");
      }

      const simulation = await simulateTransactionBase64(order.transaction);
      if (!simulation.ok) {
        throw new Error(`This swap would fail on-chain: ${simulation.error}`);
      }

      let signedTransaction: string;
      try {
        signedTransaction = await signTransaction(order.transaction);
      } catch {
        throw new Error("Signature request was rejected.");
      }

      const executeRes = await fetch("/api/jupiter/swap/execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ signedTransaction, requestId: order.requestId }),
      });
      if (!executeRes.ok) {
        throw new Error(await readApiError(executeRes, "Swap failed to execute."));
      }
      const result = (await executeRes.json()) as SwapExecuteResponse;
      if (result.status !== "Success") {
        throw new Error(result.error ?? "Swap failed.");
      }

      setSignature(result.signature);
      data.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Swap failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!data.connected) {
    return (
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <EmptyStateAction
          title="Connect your wallet"
          body="Connect a wallet to buy now."
          actionLabel="Connect Wallet"
          onAction={data.onConnect}
        />
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
        <h4 className="text-sm font-semibold text-heading">Buy Now</h4>
        <p className="mt-1 text-xs text-faint">A one-time purchase, settled immediately via Jupiter Swap.</p>

        <label className="mt-5 block text-xs font-medium text-muted">Asset</label>
        <div className="mt-1.5">
          <AssetSelector selected={asset} onSelect={setAsset} disabled={submitting} />
        </div>

        <label htmlFor="buy-amount" className="mt-4 block text-xs font-medium text-muted">
          Amount (USDC)
        </label>
        <input
          id="buy-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting}
          className="mt-1.5 w-full rounded-xl border border-border bg-page px-3 py-2 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-error-bg px-3 py-2 text-xs text-error-text">
            <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {signature && (
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-success-bg px-3 py-2 text-xs text-success-text">
            <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>Bought — {signature.slice(0, 8)}… is confirmed.</p>
          </div>
        )}

        <button
          type="button"
          disabled={submitting}
          onClick={handleBuy}
          className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Buying…" : `Buy ${asset.symbol}`}
        </button>
      </div>

      <HoldingsTable holdings={data.holdings} />
    </div>
  );
}
