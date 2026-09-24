"use client";

import Link from "next/link";
import { CalendarIcon, RefreshIcon } from "@/app/components/icons";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import { usePortfolioData } from "@/lib/jupiter/usePortfolioData";
import StatTile from "@/app/components/dashboard/StatTile";
import HoldingsTable from "@/app/components/dashboard/portfolio/HoldingsTable";
import StreakCard from "@/app/components/dashboard/portfolio/StreakCard";

const TOP_HOLDINGS_COUNT = 3;

export default function HomePageClient() {
  const data = usePortfolioData();

  if (!data.connected) {
    return (
      <div className="mt-6 rounded-2xl border border-border/60 bg-card p-6">
        <EmptyStateAction
          title="Connect your wallet"
          body="Connect a wallet to see your stack at a glance."
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
          body="Sign a message to load your stack from Jupiter — no transaction, no fees."
          actionLabel={data.authenticating ? "Waiting for signature…" : "View My Stack"}
          onAction={data.onVerify}
          disabled={data.authenticating}
        />
      </div>
    );
  }

  const stats: { label: string; value: number | null; formatter: (v: number) => string }[] = [
    { label: "Total Invested", value: data.totalInvestedUsd, formatter: (v) => `$${v.toFixed(2)}` },
    { label: "Current Value", value: data.currentValueUsd, formatter: (v) => `$${v.toFixed(2)}` },
    { label: "Active Orders", value: data.activeOrders.length, formatter: (v) => String(Math.round(v)) },
    { label: "Available USDC", value: data.usdcBalance, formatter: (v) => `$${v.toFixed(2)}` },
  ];

  const topHoldings = [...data.holdings]
    .filter((h) => h.balance > 0)
    .sort((a, b) => b.balance * (b.priceUsd ?? 0) - a.balance * (a.priceUsd ?? 0))
    .slice(0, TOP_HOLDINGS_COUNT);

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <StatTile key={stat.label} label={stat.label} value={stat.value} formatter={stat.formatter} />
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
        <div className="min-w-0 space-y-3">
          <HoldingsTable holdings={topHoldings} />
          {data.holdings.filter((h) => h.balance > 0).length > TOP_HOLDINGS_COUNT && (
            <Link href="/portfolio" className="inline-block text-xs font-medium text-primary">
              View full portfolio →
            </Link>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <h4 className="text-sm font-semibold text-heading">Quick Actions</h4>
            <div className="mt-4 space-y-3">
              <Link
                href="/buy"
                className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-left"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-heading">Buy Now</span>
                  <span className="block text-xs text-faint">One time purchase</span>
                </span>
              </Link>
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
