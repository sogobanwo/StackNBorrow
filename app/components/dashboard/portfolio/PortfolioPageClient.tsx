"use client";

import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import { usePortfolioData } from "@/lib/jupiter/usePortfolioData";
import HoldingsTable from "@/app/components/dashboard/portfolio/HoldingsTable";
import OrdersTable from "@/app/components/dashboard/portfolio/OrdersTable";

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

  return (
    <>
      {!data.rpcConfigured && (
        <p className="mt-3 text-xs text-faint">
          Set NEXT_PUBLIC_SOLANA_RPC_URL to see live wallet balances.
        </p>
      )}
      {data.loading && <p className="mt-3 text-xs text-muted">Refreshing…</p>}
      {data.error && (
        <div className="mt-4 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">{data.error}</div>
      )}

      <div className="mt-6 space-y-5">
        <HoldingsTable holdings={data.holdings} />
        <OrdersTable title="Active Orders" orders={data.activeOrders} showNextBuy />
        <OrdersTable title="Order History" orders={data.pastOrders} showNextBuy={false} />
      </div>
    </>
  );
}
