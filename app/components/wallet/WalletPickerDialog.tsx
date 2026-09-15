"use client";

import type { WalletModalState } from "@solana/react-hooks";
import { AlertIcon, CloseIcon } from "@/app/components/icons";

export default function WalletPickerDialog({ state }: { state: WalletModalState }) {
  const { connectors, connect, connecting, selectedConnector, select, close, error } = state;

  async function handleConnect(connectorId: string) {
    select(connectorId);
    try {
      await connect(connectorId);
    } catch {
      // state.error already reflects the failure — nothing else to do here
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-heading">Connect a wallet</h3>
          <button type="button" onClick={close} className="text-muted hover:text-heading">
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {connectors.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No Solana wallet found. Install a Wallet Standard wallet like Phantom or Solflare, then refresh this page.
          </p>
        ) : (
          <div className="mt-4 space-y-2">
            {connectors.map((connector) => (
              <button
                key={connector.id}
                type="button"
                disabled={connecting}
                onClick={() => handleConnect(connector.id)}
                className="flex w-full items-center justify-between rounded-xl border border-border bg-page px-4 py-3 text-left text-sm font-medium text-heading transition-colors hover:border-primary/40 disabled:opacity-60"
              >
                {connector.name}
                {connecting && selectedConnector === connector.id && (
                  <span className="text-xs text-muted">Connecting…</span>
                )}
              </button>
            ))}
          </div>
        )}

        {error !== null && error !== undefined && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error instanceof Error ? error.message : "Could not connect. Try again."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
