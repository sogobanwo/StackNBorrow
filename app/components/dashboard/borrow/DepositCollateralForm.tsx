"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import { AlertIcon } from "@/app/components/icons";
import { NVDAX_SYMBOL } from "@/lib/jupiter/assets";

export default function DepositCollateralForm({
  nvdaxWalletBalance,
  submitting,
  submitError,
  onDeposit,
}: {
  nvdaxWalletBalance: number | null;
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

  const hasBalance = nvdaxWalletBalance !== null && nvdaxWalletBalance > 0;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Deposit Collateral</h4>
      <p className="mt-1 text-xs text-faint">
        Deposit {NVDAX_SYMBOL} as collateral before you can borrow against it.
      </p>

      {!hasBalance ? (
        <p className="mt-5 text-sm text-muted">
          You don&apos;t hold any {NVDAX_SYMBOL} yet — buy some from{" "}
          <Link href="/portfolio" className="font-medium text-primary">
            Portfolio
          </Link>{" "}
          first.
        </p>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
            <Image src={nvdaxLogo} alt="" width={22} height={23} className="h-5.5 w-5.5" />
            <div>
              <p className="text-sm font-medium text-heading">{NVDAX_SYMBOL} balance</p>
              <p className="text-xs text-faint">
                {nvdaxWalletBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {NVDAX_SYMBOL}
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
