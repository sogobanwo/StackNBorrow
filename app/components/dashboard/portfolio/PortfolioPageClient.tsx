"use client";

import Link from "next/link";
import { CalendarIcon } from "@/app/components/icons";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import { usePortfolioData } from "@/lib/jupiter/usePortfolioData";
import HoldingsTable from "@/app/components/dashboard/portfolio/HoldingsTable";
import OrdersTable from "@/app/components/dashboard/portfolio/OrdersTable";
import BuyNowPanel from "@/app/components/dashboard/portfolio/BuyNowPanel";
import StreakCard from "@/app/components/dashboard/portfolio/StreakCard";

export default function PortfolioPageClient() {
  const data = usePortfolioData();

  if (!data.connected) {
    return (
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <EmptyStateAction
          title="Connect your wallet"
          body="Connect a wallet to see your portfolio."
          actionLabel="Connect Wallet"
          onAction={data.onConnect}
        />
      </div>
    );
  }

  if (data.needsVerification) {
    return (
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <EmptyStateAction
          title="Verify your wallet"
          body="Sign a message to load your portfolio from Jupiter — no transaction, no fees."
          actionLabel={data.authenticating ? "Waiting for signature…" : "View My Portfolio"}
          onAction={data.onVerify}
          disabled={data.authenticating}
        />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Invested",
      value: data.totalInvestedUsd !== null ? `$${data.totalInvestedUsd.toFixed(2)}` : "—",
    },
    {
      label: "Current Value",
      value: data.currentValueUsd !== null ? `$${data.currentValueUsd.toFixed(2)}` : "—",
    },
    { label: "Active Orders", value: String(data.activeOrders.length) },
    {
      label: "Available USDC",
      value: data.usdcBalance !== null ? `$${data.usdcBalance.toFixed(2)}` : "—",
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
          Set NEXT_PUBLIC_SOLANA_RPC_URL to see live wallet balances.
        </p>
      )}
      {data.loading && <p className="mt-3 text-xs text-muted">Refreshing…</p>}
      {data.error && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">{data.error}</div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-5">
          <HoldingsTable holdings={data.holdings} />
          <OrdersTable title="Active Orders" orders={data.activeOrders} showNextBuy />
          <OrdersTable title="Order History" orders={data.pastOrders} showNextBuy={false} />
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <h4 className="text-sm font-semibold text-heading">Quick Actions</h4>
            <div className="mt-4 space-y-3">
              <BuyNowPanel onSwapped={data.refresh} />
              <Link
                href="/setup"
                className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-heading">Create Recurring Plan</span>
                  <span className="block text-xs text-faint">Set up automatic buys</span>
                </span>
              </Link>
            </div>
          </div>
          <StreakCard totalRoundsFilled={data.totalRoundsFilled} />
        </div>
      </div>
    </>
  );
}
