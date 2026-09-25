"use client";

import { useState } from "react";
import { AlertIcon } from "@/app/components/icons";

export default function RepayDebtForm({
  debtValueUsd,
  usdcWalletBalance,
  submitting,
  submitError,
  onRepay,
  onRepayAll,
}: {
  debtValueUsd: number;
  usdcWalletBalance: number | null;
  submitting: boolean;
  submitError: string | null;
  onRepay: (amount: number) => Promise<void>;
  onRepayAll: () => Promise<void>;
}) {
  const [amount, setAmount] = useState("");
  const requested = Number(amount) || 0;
  const walletBalance = usdcWalletBalance ?? 0;
  const overBalance = requested > walletBalance;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requested <= 0 || overBalance) return;
    await onRepay(requested);
    setAmount("");
  }

  async function handleRepayAll() {
    await onRepayAll();
    setAmount("");
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Repay Debt</h4>

      <div className="mt-5 flex items-center justify-between rounded-xl border border-border bg-page px-4 py-3">
        <div>
          <p className="text-sm font-medium text-heading">Outstanding debt</p>
          <p className="text-xs text-faint">${debtValueUsd.toFixed(2)} USDC</p>
        </div>
        <button
          type="button"
          onClick={handleRepayAll}
          disabled={submitting}
          className="rounded-lg bg-subtle px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-60"
        >
          Repay Max
        </button>
      </div>

      <form className="mt-5" onSubmit={handleSubmit}>
        <label htmlFor="repay-amount" className="text-xs font-medium text-muted">
          Amount to repay (USDC)
        </label>
        <input
          id="repay-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting}
          placeholder="0.00"
          className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />
        <p className="mt-1.5 text-xs text-faint">Wallet balance: ${walletBalance.toFixed(2)} USDC</p>

        {overBalance && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>That&apos;s more USDC than you have in your wallet.</p>
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
          disabled={submitting || requested <= 0 || overBalance}
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Repaying…" : "Repay USDC"}
        </button>
      </form>
    </div>
  );
}
