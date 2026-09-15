"use client";

import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import DepositCollateralForm from "@/app/components/dashboard/borrow/DepositCollateralForm";
import BorrowForm from "@/app/components/dashboard/borrow/BorrowForm";
import PositionSummary from "@/app/components/dashboard/borrow/PositionSummary";
import { useBorrowData } from "@/lib/jupiter/useBorrowData";
import { NVDAX_SYMBOL } from "@/lib/jupiter/assets";

export default function BorrowPageClient() {
  const data = useBorrowData();

  if (!data.connected) {
    return (
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <EmptyStateAction
          title="Connect your wallet"
          body="Connect a wallet to deposit collateral and borrow."
          actionLabel="Connect Wallet"
          onAction={data.onConnect}
        />
      </div>
    );
  }

  const stats = [
    { label: "Collateral Value", value: `$${data.collateralValueUsd.toFixed(2)}` },
    { label: "Borrowing Power", value: `$${data.maxBorrowUsd.toFixed(2)}` },
    { label: "Current Debt", value: `$${data.debtValueUsd.toFixed(2)}` },
    {
      label: "Current LTV",
      value: data.debtValueUsd > 0 ? `${(data.currentLtv * 100).toFixed(1)}%` : "—",
    },
  ];

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/2"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold text-heading">{stat.value}</p>
          </div>
        ))}
      </div>

      {!data.rpcConfigured && (
        <p className="mt-3 text-xs text-faint">
          Set NEXT_PUBLIC_SOLANA_RPC_URL to see your live {NVDAX_SYMBOL} wallet balance.
        </p>
      )}
      {data.loading && <p className="mt-3 text-xs text-muted">Refreshing…</p>}
      {data.error && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">{data.error}</div>
      )}
      {!data.loading && !data.error && !data.vault && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
          No {NVDAX_SYMBOL} lending market found — it may not be listed as Lend collateral right now.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        {data.collateralUiAmount > 0 ? (
          <BorrowForm
            collateralUiAmount={data.collateralUiAmount}
            collateralValueUsd={data.collateralValueUsd}
            debtValueUsd={data.debtValueUsd}
            maxLtv={data.maxLtv}
            maxBorrowUsd={data.maxBorrowUsd}
            submitting={data.submitting}
            submitError={data.submitError}
            onBorrow={data.borrow}
          />
        ) : (
          <DepositCollateralForm
            nvdaxWalletBalance={data.nvdaxWalletBalance}
            submitting={data.submitting}
            submitError={data.submitError}
            onDeposit={data.depositCollateral}
          />
        )}

        <PositionSummary
          collateralValueUsd={data.collateralValueUsd}
          debtValueUsd={data.debtValueUsd}
          currentLtv={data.currentLtv}
          liquidationLtv={data.liquidationLtv}
        />
      </div>
    </>
  );
}
