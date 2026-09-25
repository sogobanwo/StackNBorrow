"use client";

import { useState } from "react";
import { AlertIcon } from "@/app/components/icons";
import AssetBadge from "@/app/components/dashboard/AssetBadge";
import type { XStockAsset } from "@/lib/jupiter/assets";

export default function WithdrawCollateralForm({
  asset,
  collateralUiAmount,
  collateralValueUsd,
  debtValueUsd,
  maxLtv,
  assetPriceUsd,
  submitting,
  submitError,
  onWithdraw,
  onWithdrawAll,
}: {
  asset: XStockAsset;
  collateralUiAmount: number;
  collateralValueUsd: number;
  debtValueUsd: number;
  maxLtv: number;
  assetPriceUsd: number | null;
  submitting: boolean;
  submitError: string | null;
  onWithdraw: (amount: number) => Promise<void>;
  onWithdrawAll: () => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const requested = Number(amount) || 0;
  const hasDebt = debtValueUsd > 0;

  // Cap partial withdrawals at whatever keeps remaining collateral under maxLtv — "withdraw all" while
  // debt > 0 would leave the position undercollateralized, so that action is only offered debt-free.
  const requiredCollateralUsd = hasDebt && maxLtv > 0 ? debtValueUsd / maxLtv : 0;
  const maxWithdrawableUsd = Math.max(0, collateralValueUsd - requiredCollateralUsd);
  const maxWithdrawableUiAmount = assetPriceUsd ? maxWithdrawableUsd / assetPriceUsd : collateralUiAmount;
  const overLimit = requested > maxWithdrawableUiAmount;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requested <= 0 || overLimit) return;
    await onWithdraw(requested);
    setAmount("");
  }

  async function handleWithdrawAll() {
    await onWithdrawAll();
    setAmount("");
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Withdraw Collateral</h4>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-page px-4 py-3">
        <div className="flex items-center gap-2.5">
          <AssetBadge asset={asset} className="h-6 w-6 text-[10px]" />
          <div>
            <p className="text-sm font-medium text-heading">{asset.symbol} collateral</p>
            <p className="text-xs text-faint">
              {collateralUiAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol} · $
              {collateralValueUsd.toFixed(2)}
            </p>
          </div>
        </div>
        {!hasDebt && (
          <button
            type="button"
            onClick={handleWithdrawAll}
            disabled={submitting}
            className="rounded-lg bg-subtle px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
          >
            Withdraw All
          </button>
        )}
      </div>

      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor="withdraw-amount" className="text-xs font-medium text-muted">
          Amount to withdraw ({asset.symbol})
        </label>
        <input
          id="withdraw-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting}
          placeholder="0.00"
          className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />
        <p className="mt-1.5 text-xs text-faint">
          Max withdrawable: {maxWithdrawableUiAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
          {asset.symbol}
          {hasDebt && " — keeps your remaining collateral above the borrow limit"}
        </p>

        {overLimit && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>That would leave too little collateral for your outstanding debt.</p>
          </div>
        )}

        {submitError && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || requested <= 0 || overLimit}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Withdrawing…" : "Withdraw"}
        </button>
      </form>
    </div>
  );
}
