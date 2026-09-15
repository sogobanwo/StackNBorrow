"use client";

import { useState } from "react";
import { AlertIcon, CheckIcon, RefreshIcon } from "@/app/components/icons";
import { NVDAX_MINT, NVDAX_SYMBOL, USDC_DECIMALS, USDC_MINT } from "@/lib/jupiter/assets";
import { readApiError } from "@/lib/jupiter/apiError";
import { useSigner } from "@/lib/wallet/useSigner";
import type { SwapExecuteResponse, SwapOrderResponse } from "@/lib/jupiter/types";

const DEFAULT_SLIPPAGE_BPS = 50; // 0.5% — a conservative default, not a Jupiter-mandated value

export default function BuyNowPanel({ onSwapped }: { onSwapped: () => void }) {
  const { connected, address, signTransaction } = useSigner();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("10");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  async function handleBuy() {
    if (!connected || !address) {
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
        outputMint: NVDAX_MINT,
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
      onSwapped();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Swap failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <RefreshIcon className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-sm font-medium text-heading">Buy Now</span>
          <span className="block text-xs text-faint">One time purchase</span>
        </span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-page p-4">
      <label htmlFor="buy-now-amount" className="text-xs font-medium text-muted">
        Amount (USDC)
      </label>
      <input
        id="buy-now-amount"
        type="text"
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        disabled={submitting}
        className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
      />

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-error-bg px-3 py-2 text-xs text-error-text">
          <AlertIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {signature && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-success-bg px-3 py-2 text-xs text-success-text">
          <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <p>Swap sent — {signature.slice(0, 8)}…</p>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={submitting}
          onClick={handleBuy}
          className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Buying…" : `Buy ${NVDAX_SYMBOL}`}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={() => setOpen(false)}
          className="rounded-xl bg-subtle px-3 py-2 text-xs font-medium text-muted"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
