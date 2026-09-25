"use client";

import { useState } from "react";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import AssetSelector from "@/app/components/dashboard/AssetSelector";
import DepositCollateralForm from "@/app/components/dashboard/borrow/DepositCollateralForm";
import BorrowForm from "@/app/components/dashboard/borrow/BorrowForm";
import RepayDebtForm from "@/app/components/dashboard/borrow/RepayDebtForm";
import WithdrawCollateralForm from "@/app/components/dashboard/borrow/WithdrawCollateralForm";
import PositionSummary from "@/app/components/dashboard/borrow/PositionSummary";
import StatTile from "@/app/components/dashboard/StatTile";
import { useBorrowData } from "@/lib/jupiter/useBorrowData";
import { DEFAULT_ASSET, SUPPORTED_ASSETS, type XStockAsset } from "@/lib/jupiter/assets";

const LEND_ELIGIBLE_ASSETS = SUPPORTED_ASSETS.filter((asset) => asset.lendEligible);

type PositionTab = "deposit" | "borrow" | "repay" | "withdraw";
const POSITION_TABS: { id: PositionTab; label: string }[] = [
  { id: "deposit", label: "Deposit" },
  { id: "borrow", label: "Borrow" },
  { id: "repay", label: "Repay" },
  { id: "withdraw", label: "Withdraw" },
];

export default function BorrowPageClient() {
  const [asset, setAsset] = useState<XStockAsset>(DEFAULT_ASSET);
  const [activeTab, setActiveTab] = useState<PositionTab>("borrow");
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
        <div className="space-y-4">
          {data.collateralUiAmount > 0 && (
            <div className="flex gap-1 rounded-2xl border border-border/60 bg-card p-1.5 shadow-sm shadow-slate-900/2">
              {POSITION_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    activeTab === tab.id
                      ? "flex-1 rounded-xl bg-primary py-2 text-sm font-medium text-white"
                      : "flex-1 rounded-xl py-2 text-sm font-medium text-muted hover:bg-subtle"
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {data.collateralUiAmount === 0 || activeTab === "deposit" ? (
            <DepositCollateralForm
              asset={asset}
              assetWalletBalance={data.assetWalletBalance}
              submitting={data.submitting}
              submitError={data.submitError}
              onDeposit={data.depositCollateral}
            />
          ) : activeTab === "borrow" ? (
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
          ) : activeTab === "repay" ? (
            <RepayDebtForm
              debtValueUsd={data.debtValueUsd}
              usdcWalletBalance={data.usdcWalletBalance}
              submitting={data.submitting}
              submitError={data.submitError}
              onRepay={data.repayDebt}
              onRepayAll={data.repayAllDebt}
            />
          ) : (
            <WithdrawCollateralForm
              asset={asset}
              collateralUiAmount={data.collateralUiAmount}
              collateralValueUsd={data.collateralValueUsd}
              debtValueUsd={data.debtValueUsd}
              maxLtv={data.maxLtv}
              assetPriceUsd={data.assetPriceUsd}
              submitting={data.submitting}
              submitError={data.submitError}
              onWithdraw={data.withdrawCollateral}
              onWithdrawAll={data.withdrawAllCollateral}
            />
          )}
        </div>

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
