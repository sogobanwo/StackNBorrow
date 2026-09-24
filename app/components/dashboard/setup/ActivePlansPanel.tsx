"use client";

import PlanRow from "@/app/components/dashboard/setup/PlanRow";
import EmptyStateAction from "@/app/components/dashboard/EmptyStateAction";
import { AlertIcon } from "@/app/components/icons";
import type { DcaOrderHistoryItem } from "@/lib/jupiter/types";
import { useRowReveal } from "@/lib/motion/useRowReveal";

export default function ActivePlansPanel({
  connected,
  onConnect,
  authenticating,
  needsVerification,
  onVerify,
  loading,
  error,
  onRetry,
  plans,
  onCancel,
  cancellingId,
}: {
  connected: boolean;
  onConnect: () => void;
  authenticating: boolean;
  needsVerification: boolean;
  onVerify: () => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  plans: DcaOrderHistoryItem[] | null;
  onCancel: (plan: DcaOrderHistoryItem) => void;
  cancellingId: string | null;
}) {
  const tbodyRef = useRowReveal<HTMLTableSectionElement>(plans?.length ?? 0);

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Your Active Plans</h4>

      {!connected && (
        <EmptyStateAction
          title="Connect your wallet"
          body="Connect a wallet to see your recurring buy plans."
          actionLabel="Connect Wallet"
          onAction={onConnect}
        />
      )}

      {connected && needsVerification && !authenticating && (
        <EmptyStateAction
          title="Verify your wallet"
          body="Sign a message to load your plans from Jupiter — no transaction, no fees."
          actionLabel="View My Plans"
          onAction={onVerify}
        />
      )}

      {authenticating && <p className="mt-4 text-sm text-muted">Waiting for signature…</p>}

      {connected && !needsVerification && loading && (
        <p className="mt-4 text-sm text-muted">Loading your plans…</p>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
          <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p>{error}</p>
            <button type="button" onClick={onRetry} className="mt-1 text-xs font-semibold underline">
              Try again
            </button>
          </div>
        </div>
      )}

      {connected && !needsVerification && !loading && !error && plans && plans.length === 0 && (
        <EmptyStateAction title="No plans yet" body="Create a recurring plan to see it listed here." />
      )}

      {plans && plans.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-105 text-left text-sm">
            <thead>
              <tr className="text-xs text-faint">
                <th className="pb-3 pr-2 font-medium">Ticker</th>
                <th className="pb-3 pr-2 font-medium">Amount</th>
                <th className="pb-3 pr-2 font-medium">Progress</th>
                <th className="pb-3 pr-2 font-medium">Next Buy</th>
                <th className="pb-3 pr-2 font-medium">Status</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody ref={tbodyRef}>
              {plans.map((plan) => (
                <PlanRow key={plan.id} plan={plan} onCancel={onCancel} cancelling={cancellingId === plan.id} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
