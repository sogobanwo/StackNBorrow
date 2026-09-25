"use client";

import { useCallback, useEffect, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import { useJupiterSession } from "@/lib/jupiter/useJupiterSession";
import { readApiError } from "@/lib/jupiter/apiError";
import { simulateTransactionBase64 } from "@/lib/solana/simulate";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import DemoModeToggle from "@/app/components/dashboard/setup/DemoModeToggle";
import CreatePlanForm from "@/app/components/dashboard/setup/CreatePlanForm";
import ActivePlansPanel from "@/app/components/dashboard/setup/ActivePlansPanel";
import type {
  CancelDcaInitiateResponse,
  DcaOrderHistoryItem,
  DcaOrderHistoryResponse,
} from "@/lib/jupiter/types";

export default function SetupPageClient() {
  const { connected, address, login, signTransaction } = useSigner();
  const { token, authenticating, ensureToken, authedFetch, ensureVault } = useJupiterSession();
  const [demoMode, setDemoMode] = useState(false);

  const [plans, setPlans] = useState<DcaOrderHistoryItem[] | null>(null);
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansError, setPlansError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setPlansLoading(true);
    setPlansError(null);
    try {
      await ensureToken();
      const res = await authedFetch("/api/jupiter/trigger/orders/dca/history?state=active");
      if (!res.ok) {
        throw new Error(await readApiError(res, "Could not load your plans."));
      }
      const data = (await res.json()) as DcaOrderHistoryResponse;
      setPlans(data.orders);
    } catch (error) {
      setPlansError(error instanceof Error ? error.message : "Could not load your plans.");
    } finally {
      setPlansLoading(false);
    }
  }, [ensureToken, authedFetch]);

  const [plansForConnected, setPlansForConnected] = useState(connected);
  if (connected !== plansForConnected) {
    setPlansForConnected(connected);
    if (!connected) setPlans(null);
  }

  useEffect(() => {
    if (connected && token) {
      // Defer to a microtask so loadPlans' setState calls land after this effect commits, not inside it.
      void Promise.resolve().then(() => loadPlans());
    }
  }, [connected, token, loadPlans]);

  async function handleCancel(plan: DcaOrderHistoryItem) {
    setCancellingId(plan.id);
    setPlansError(null);
    try {
      const initiateRes = await authedFetch(`/api/jupiter/trigger/orders/dca/cancel/${plan.id}`, {
        method: "POST",
      });
      if (!initiateRes.ok) {
        throw new Error(await readApiError(initiateRes, "Could not start cancellation."));
      }
      const initiate = (await initiateRes.json()) as CancelDcaInitiateResponse;

      const simulation = await simulateTransactionBase64(initiate.transaction);
      if (!simulation.ok) {
        throw new Error(`This cancellation would fail on-chain: ${simulation.error}`);
      }

      let signedTransaction: string;
      try {
        signedTransaction = await signTransaction(initiate.transaction);
      } catch {
        throw new Error("Signature request was rejected.");
      }

      const confirmRes = await authedFetch(`/api/jupiter/trigger/orders/dca/confirm-cancel/${plan.id}`, {
        method: "POST",
        body: JSON.stringify({ signedTransaction }),
      });
      if (!confirmRes.ok) {
        throw new Error(await readApiError(confirmRes, "Could not confirm cancellation."));
      }

      await loadPlans();
    } catch (error) {
      setPlansError(error instanceof Error ? error.message : "Could not cancel this plan.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <>
      <DashboardTopBar
        title="Setup"
        subtitle="Create and manage your recurring buy plans."
        actions={<DemoModeToggle enabled={demoMode} onChange={setDemoMode} />}
      />
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
        <CreatePlanForm
          connected={connected}
          onConnect={login}
          address={address}
          ensureToken={ensureToken}
          authedFetch={authedFetch}
          ensureVault={ensureVault}
          signTransaction={signTransaction}
          onPlanCreated={loadPlans}
          demoMode={demoMode}
        />
        <ActivePlansPanel
          connected={connected}
          onConnect={login}
          authenticating={authenticating}
          needsVerification={connected && !token}
          onVerify={loadPlans}
          loading={plansLoading}
          error={plansError}
          onRetry={loadPlans}
          plans={plans}
          onCancel={handleCancel}
          cancellingId={cancellingId}
        />
      </div>
    </>
  );
}
