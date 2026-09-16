"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertIcon } from "@/app/components/icons";
import AssetBadge from "@/app/components/dashboard/AssetBadge";
import type { XStockAsset } from "@/lib/jupiter/assets";

export default function DepositCollateralForm({
  asset,
  assetWalletBalance,
  submitting,
  submitError,
  onDeposit,
}: {
  asset: XStockAsset;
  assetWalletBalance: number | null;
  submitting: boolean;
  submitError: string | null;
  onDeposit: (amount: number) => Promise<void>;
}) {
  const [amount, setAmount] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return;
    await onDeposit(value);
  }

  const hasBalance = assetWalletBalance !== null && assetWalletBalance > 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Deposit Collateral</h4>
      <p className="mt-1 text-xs text-faint">
        Deposit {asset.symbol} as collateral before you can borrow against it.
      </p>

      {!hasBalance ? (
        <p className="mt-5 text-sm text-muted">
          You don&apos;t hold any {asset.symbol} yet — buy some from{" "}
          <Link href="/portfolio" className="font-medium text-primary">
            Portfolio
          </Link>{" "}
          first.
        </p>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
            <AssetBadge asset={asset} className="h-6 w-6 text-[10px]" />
            <div>
              <p className="text-sm font-medium text-heading">{asset.symbol} balance</p>
              <p className="text-xs text-faint">
                {assetWalletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {asset.symbol}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="deposit-amount" className="text-xs font-medium text-muted">
              Amount to deposit
            </label>
            <input
              id="deposit-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              disabled={submitting}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            />
          </div>

          {submitError && (
            <div className="flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? "Depositing…" : "Deposit Collateral"}
          </button>
        </form>
      )}
    </div>
  );
}
