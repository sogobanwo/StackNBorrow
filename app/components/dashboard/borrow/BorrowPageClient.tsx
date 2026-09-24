"use client";

import { useState } from "react";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import AssetSelector from "@/app/components/dashboard/AssetSelector";
import DepositCollateralForm from "@/app/components/dashboard/borrow/DepositCollateralForm";
import BorrowForm from "@/app/components/dashboard/borrow/BorrowForm";
import PositionSummary from "@/app/components/dashboard/borrow/PositionSummary";
import StatTile from "@/app/components/dashboard/StatTile";
import { useBorrowData } from "@/lib/jupiter/useBorrowData";
import { DEFAULT_ASSET, SUPPORTED_ASSETS, type XStockAsset } from "@/lib/jupiter/assets";

const LEND_ELIGIBLE_ASSETS = SUPPORTED_ASSETS.filter((asset) => asset.lendEligible);

export default function BorrowPageClient() {
  const [asset, setAsset] = useState<XStockAsset>(DEFAULT_ASSET);
  const data = useBorrowData(asset);

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

  const stats: { label: string; value: number | null; formatter: (v: number) => string }[] = [
    { label: "Collateral Value", value: data.collateralValueUsd, formatter: (v) => `$${v.toFixed(2)}` },
    { label: "Borrowing Power", value: data.maxBorrowUsd, formatter: (v) => `$${v.toFixed(2)}` },
    { label: "Current Debt", value: data.debtValueUsd, formatter: (v) => `$${v.toFixed(2)}` },
    {
      label: "Current LTV",
      value: data.debtValueUsd > 0 ? data.currentLtv * 100 : null,
      formatter: (v) => `${v.toFixed(1)}%`,
    },
  ];

  return (
    <>
      <div className="mt-6">
        <AssetSelector
          selected={asset}
          onSelect={setAsset}
          disabled={data.submitting}
          assets={LEND_ELIGIBLE_ASSETS}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} label={stat.label} value={stat.value} formatter={stat.formatter} />
        ))}
      </div>

      {!data.rpcConfigured && (
        <p className="mt-3 text-xs text-faint">
          Set NEXT_PUBLIC_SOLANA_RPC_URL to see your live {asset.symbol} wallet balance.
        </p>
      )}
      {data.loading && <p className="mt-3 text-xs text-muted">Refreshing…</p>}
      {data.error && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">{data.error}</div>
      )}
      {!data.loading && !data.error && !data.vault && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
          No {asset.symbol} lending market found — it may not be listed as Lend collateral right now.
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        {data.collateralUiAmount > 0 ? (
          <BorrowForm
            asset={asset}
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
            asset={asset}
            assetWalletBalance={data.assetWalletBalance}
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
