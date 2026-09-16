"use client";

import { useEffect, useRef, useState } from "react";
import { AlertIcon, CalendarIcon, CheckIcon } from "@/app/components/icons";
import AssetSelector from "@/app/components/dashboard/AssetSelector";
import { DEFAULT_ASSET, USDC_DECIMALS, USDC_MINT, type XStockAsset } from "@/lib/jupiter/assets";
import { readApiError } from "@/lib/jupiter/apiError";
import { getReadonlyConnection, getSolBalance, getSplTokenBalance } from "@/lib/solana/balances";
import { simulateTransactionBase64 } from "@/lib/solana/simulate";
import type { CreateDcaOrderResponse, DepositCraftResponse } from "@/lib/jupiter/types";

const FREQUENCIES = [
  { label: "Daily", seconds: 86400 },
  { label: "Weekly", seconds: 604800 },
  { label: "Monthly", seconds: 2592000 },
];

const DEMO_FREQUENCIES = [
  { label: "1 min", seconds: 60 },
  { label: "2 mins", seconds: 120 },
  { label: "5 mins", seconds: 300 },
];

const MIN_SOL_FOR_FEES = 0.01; // conservative buffer for a couple of transactions, not an exact fee quote

export default function CreatePlanForm({
  connected,
  onConnect,
  address,
  ensureToken,
  authedFetch,
  signTransaction,
  onPlanCreated,
  demoMode,
}: {
  connected: boolean;
  onConnect: () => void;
  address: string | null;
  ensureToken: () => Promise<string>;
  authedFetch: (path: string, init?: RequestInit) => Promise<Response>;
  signTransaction: (base64Tx: string) => Promise<string>;
  onPlanCreated: () => void;
  demoMode: boolean;
}) {
  const frequencies = demoMode ? DEMO_FREQUENCIES : FREQUENCIES;
  const [asset, setAsset] = useState<XStockAsset>(DEFAULT_ASSET);
  const [amount, setAmount] = useState("20");
  const [frequencySeconds, setFrequencySeconds] = useState(FREQUENCIES[1].seconds);
  const [orderCount, setOrderCount] = useState("4");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Must reset to true in the effect body, not just rely on the useRef initializer — React 18
  // Strict Mode's dev-only mount→cleanup→mount cycle otherwise leaves this stuck at false forever,
  // which silently skips every setState below and leaves the button on "Creating Plan…" forever.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const [prevDemoMode, setPrevDemoMode] = useState(demoMode);
  if (demoMode !== prevDemoMode) {
    setPrevDemoMode(demoMode);
    setFrequencySeconds(frequencies[0].seconds);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    if (!connected || !address) {
      setFormError("Connect your wallet first.");
      return;
    }

    const amountPerRound = Number(amount);
    const rounds = Number(orderCount);
    if (!Number.isFinite(amountPerRound) || amountPerRound <= 0) {
      setFormError("Enter a valid USDC amount.");
      return;
    }
    if (!Number.isInteger(rounds) || rounds < 2) {
      setFormError("Number of buys must be a whole number of 2 or more.");
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSuccessId(null);

    const totalAmountUsdc = amountPerRound * rounds;
    const totalAmountSmallestUnits = Math.round(totalAmountUsdc * 10 ** USDC_DECIMALS).toString();

    try {
      await ensureToken();

      try {
        const connection = getReadonlyConnection();
        if (connection) {
          const [usdcBalance, solBalance] = await Promise.all([
            getSplTokenBalance(connection, address, USDC_MINT),
            getSolBalance(connection, address),
          ]);
          if (usdcBalance < totalAmountUsdc) {
            throw new Error(
              `Insufficient USDC — you have $${usdcBalance.toFixed(2)}, this plan needs $${totalAmountUsdc.toFixed(2)}.`
            );
          }
          if (solBalance < MIN_SOL_FOR_FEES) {
            throw new Error("Not enough SOL to cover network fees. Fund your wallet with a small amount of SOL.");
          }
        }
      } catch (balanceError) {
        if (balanceError instanceof Error && balanceError.message.startsWith("Insufficient")) throw balanceError;
        if (balanceError instanceof Error && balanceError.message.startsWith("Not enough SOL")) throw balanceError;
        // RPC not configured or unreachable — let Jupiter's own validation catch insufficient funds instead of hanging here
      }

      const depositRes = await authedFetch("/api/jupiter/trigger/deposit", {
        method: "POST",
        body: JSON.stringify({
          inputMint: USDC_MINT,
          outputMint: asset.mint,
          userAddress: address,
          amount: totalAmountSmallestUnits,
        }),
      });
      if (!depositRes.ok) {
        throw new Error(await readApiError(depositRes, "Could not prepare the deposit. Try again."));
      }
      const deposit = (await depositRes.json()) as DepositCraftResponse;

      const simulation = await simulateTransactionBase64(deposit.transaction);
      if (!simulation.ok) {
        throw new Error(`This deposit would fail on-chain: ${simulation.error}`);
      }

      let depositSignedTx: string;
      try {
        depositSignedTx = await signTransaction(deposit.transaction);
      } catch {
        throw new Error("Signature request was rejected.");
      }

      const orderRes = await authedFetch("/api/jupiter/trigger/orders/dca", {
        method: "POST",
        body: JSON.stringify({
          depositRequestId: deposit.requestId,
          depositSignedTx,
          orderCount: rounds,
          intervalSeconds: frequencySeconds,
          triggerMint: asset.mint,
        }),
      });
      if (!orderRes.ok) {
        throw new Error(await readApiError(orderRes, "Could not create the plan. Try again."));
      }
      const order = (await orderRes.json()) as CreateDcaOrderResponse;

      if (!mountedRef.current) return;
      setSuccessId(order.id);
      onPlanCreated();
    } catch (error) {
      if (!mountedRef.current) return;
      setFormError(error instanceof Error ? error.message : "Something went wrong. Try again.");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
      <h4 className="text-sm font-semibold text-heading">Create a New Plan</h4>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-medium text-muted">Asset</label>
          <div className="mt-1.5">
            <AssetSelector selected={asset} onSelect={setAsset} disabled={submitting} />
          </div>
        </div>

        <div>
          <label htmlFor="setup-amount" className="text-xs font-medium text-muted">
            Amount per buy (USDC)
          </label>
          <input
            id="setup-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={submitting}
            className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted">
            Frequency
            {demoMode && <span className="ml-2 text-[10px] font-normal text-primary">Demo intervals</span>}
          </label>
          <div className="mt-1.5 flex gap-2">
            {frequencies.map((freq) => (
              <button
                type="button"
                key={freq.label}
                disabled={submitting}
                onClick={() => setFrequencySeconds(freq.seconds)}
                className={
                  freq.seconds === frequencySeconds
                    ? "flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-white"
                    : "flex-1 rounded-xl bg-subtle py-2.5 text-center text-sm font-medium text-muted"
                }
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="setup-count" className="text-xs font-medium text-muted">
            Number of buys (min 2)
          </label>
          <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted" />
            <input
              id="setup-count"
              type="text"
              inputMode="numeric"
              value={orderCount}
              onChange={(event) => setOrderCount(event.target.value)}
              disabled={submitting}
              className="w-full bg-transparent text-sm text-heading outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {formError && (
          <div className="flex items-start gap-2.5 rounded-xl bg-error-bg px-4 py-3 text-sm text-error-text">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{formError}</p>
          </div>
        )}

        {successId && (
          <div className="flex items-start gap-2.5 rounded-xl bg-success-bg px-4 py-3 text-sm text-success-text">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Plan created — order {successId.slice(0, 8)}… is live.</p>
          </div>
        )}

        {connected ? (
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? "Creating Plan…" : "Create Plan"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Connect Wallet
          </button>
        )}
      </form>
    </div>
  );
}
