"use client";

import { useCallback, useEffect, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import { readApiError } from "@/lib/jupiter/apiError";
import { getReadonlyConnection, getSplTokenBalance } from "@/lib/solana/balances";
import { NVDAX_DECIMALS, NVDAX_MINT, USDC_DECIMALS, USDC_MINT } from "@/lib/jupiter/assets";
import type {
  LendBorrowVault,
  LendOperateRequest,
  LendOperateResponse,
  LendPosition,
  PriceResponse,
} from "@/lib/jupiter/types";

export interface BorrowData {
  connected: boolean;
  onConnect: () => void;
  loading: boolean;
  error: string | null;
  rpcConfigured: boolean;
  vault: LendBorrowVault | null;
  position: LendPosition | null;
  nvdaxWalletBalance: number | null;
  nvdaxPriceUsd: number | null;
  collateralUiAmount: number;
  debtUiAmount: number;
  collateralValueUsd: number;
  debtValueUsd: number;
  maxLtv: number; // 0-1
  liquidationLtv: number; // 0-1
  currentLtv: number; // 0-1
  maxBorrowUsd: number;
  submitting: boolean;
  submitError: string | null;
  depositCollateral: (nvdaxAmount: number) => Promise<void>;
  borrow: (usdcAmount: number) => Promise<void>;
  refresh: () => void;
}

export function useBorrowData(): BorrowData {
  const { connected, address, signAndSendTransaction, login } = useSigner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vault, setVault] = useState<LendBorrowVault | null>(null);
  const [position, setPosition] = useState<LendPosition | null>(null);
  const [nvdaxWalletBalance, setNvdaxWalletBalance] = useState<number | null>(null);
  const [nvdaxPriceUsd, setNvdaxPriceUsd] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const rpcConfigured = getReadonlyConnection() !== null;

  const load = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const vaultsRes = await fetch("/api/jupiter/lend/vaults");
      if (!vaultsRes.ok) throw new Error(await readApiError(vaultsRes, "Could not load lending markets."));
      const vaults = (await vaultsRes.json()) as LendBorrowVault[];
      const nvdaxVault = vaults.find((v) => v.supplyToken === NVDAX_MINT && v.borrowToken === USDC_MINT) ?? null;
      setVault(nvdaxVault);

      if (nvdaxVault) {
        const positionsRes = await fetch(
          `/api/jupiter/lend/positions?users=${encodeURIComponent(address)}`
        );
        if (!positionsRes.ok) {
          throw new Error(await readApiError(positionsRes, "Could not load your position."));
        }
        const positions = (await positionsRes.json()) as LendPosition[];
        setPosition(positions.find((p) => p.vaultId === nvdaxVault.id) ?? null);
      }

      const pricePromise = fetch(`/api/jupiter/price?ids=${NVDAX_MINT}`)
        .then((res) => (res.ok ? (res.json() as Promise<PriceResponse>) : null))
        .then((data) => setNvdaxPriceUsd(data?.[NVDAX_MINT]?.usdPrice ?? null))
        .catch(() => setNvdaxPriceUsd(null));

      const balancePromise = (async () => {
        const connection = getReadonlyConnection();
        if (!connection) return;
        setNvdaxWalletBalance(await getSplTokenBalance(connection, address, NVDAX_MINT));
      })();

      await Promise.all([pricePromise, balancePromise]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your borrow position.");
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (connected) {
      void Promise.resolve().then(() => load());
    }
  }, [connected, load]);

  const collateralUiAmount = position ? Number(position.supply) / 10 ** NVDAX_DECIMALS : 0;
  const debtUiAmount = position ? Number(position.borrow) / 10 ** USDC_DECIMALS : 0;
  const collateralValueUsd = nvdaxPriceUsd !== null ? collateralUiAmount * nvdaxPriceUsd : 0;
  const debtValueUsd = debtUiAmount; // USDC ≈ $1
  const maxLtv = vault ? vault.collateralFactor / 10000 : 0;
  const liquidationLtv = vault ? vault.liquidationThreshold / 10000 : 0;
  const currentLtv = collateralValueUsd > 0 ? debtValueUsd / collateralValueUsd : 0;
  const maxBorrowUsd = Math.max(0, collateralValueUsd * maxLtv - debtValueUsd);

  async function operate(colAmount: string, debtAmount: string): Promise<void> {
    if (!connected || !address || !vault) {
      throw new Error("Connect your wallet first.");
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload: LendOperateRequest = {
        vaultId: vault.id,
        positionId: position?.id ?? 0,
        signer: address,
        colAmount,
        debtAmount,
      };
      const res = await fetch("/api/jupiter/lend/operate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(await readApiError(res, "Transaction could not be prepared."));
      }
      const { transaction } = (await res.json()) as LendOperateResponse;

      try {
        await signAndSendTransaction(transaction);
      } catch {
        throw new Error("Signature request was rejected.");
      }

      await load();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Transaction failed.");
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  async function depositCollateral(nvdaxAmount: number): Promise<void> {
    const smallestUnits = Math.round(nvdaxAmount * 10 ** NVDAX_DECIMALS).toString();
    await operate(smallestUnits, "0");
  }

  async function borrow(usdcAmount: number): Promise<void> {
    const smallestUnits = Math.round(usdcAmount * 10 ** USDC_DECIMALS).toString();
    await operate("0", smallestUnits);
  }

  return {
    connected,
    onConnect: login,
    loading,
    error,
    rpcConfigured,
    vault,
    position,
    nvdaxWalletBalance,
    nvdaxPriceUsd,
    collateralUiAmount,
    debtUiAmount,
    collateralValueUsd,
    debtValueUsd,
    maxLtv,
    liquidationLtv,
    currentLtv,
    maxBorrowUsd,
    submitting,
    submitError,
    depositCollateral,
    borrow,
    refresh: load,
  };
}
