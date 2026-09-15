"use client";

import { useState } from "react";
import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import { AlertIcon } from "@/app/components/icons";
import { NVDAX_SYMBOL } from "@/lib/jupiter/assets";

export default function BorrowForm({
  collateralUiAmount,
  collateralValueUsd,
  debtValueUsd,
  maxLtv,
  maxBorrowUsd,
  submitting,
  submitError,
  onBorrow,
}: {
  collateralUiAmount: number;
  collateralValueUsd: number;
  debtValueUsd: number;
  maxLtv: number;
  maxBorrowUsd: number;
  submitting: boolean;
  submitError: string | null;
  onBorrow: (amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const requested = Number(amount) || 0;
  const overLimit = requested > maxBorrowUsd;
  const projectedDebt = debtValueUsd + Math.min(requested, maxBorrowUsd);
  const projectedLtv = collateralValueUsd > 0 ? projectedDebt / collateralValueUsd : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requested <= 0 || overLimit) return;
    await onBorrow(requested);
    setAmount("");
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Borrow USDC</h4>

      <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
        <Image src={nvdaxLogo} alt="" width={22} height={23} className="h-5.5 w-5.5" />
        <div>
          <p className="text-sm font-medium text-heading">{NVDAX_SYMBOL} collateral</p>
          <p className="text-xs text-faint">
            {collateralUiAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {NVDAX_SYMBOL} · $
            {collateralValueUsd.toFixed(2)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="borrow-amount" className="mt-5 block text-xs font-medium text-muted">
          Amount to borrow (USDC)
        </label>
        <input
          id="borrow-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting || maxBorrowUsd <= 0}
          placeholder="0.00"
          className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-faint">
            <span>Loan-to-Value</span>
            <span>{Math.round(maxLtv * 100)}% max</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-subtle">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.min(100, projectedLtv * 100)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-faint">
            Borrowing ${projectedDebt.toFixed(2)} against ${collateralValueUsd.toFixed(2)} collateral ·{" "}
            {(projectedLtv * 100).toFixed(1)}% LTV · max ${maxBorrowUsd.toFixed(2)}
          </p>
        </div>

        {overLimit && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>That&apos;s above your safe borrow limit of ${maxBorrowUsd.toFixed(2)}.</p>
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
          {submitting ? "Borrowing…" : "Borrow USDC"}
        </button>
      </form>
    </div>
  );
}
