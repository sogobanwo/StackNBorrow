"use client";

import { useCallback, useEffect, useState } from "react";
import { useSigner } from "@/lib/wallet/useSigner";
import { readApiError } from "@/lib/jupiter/apiError";
import { getReadonlyConnection, getSplTokenBalance } from "@/lib/solana/balances";
import { simulateTransactionBase64 } from "@/lib/solana/simulate";
import { LEND_MIN_I128, USDC_DECIMALS, USDC_MINT, type XStockAsset } from "@/lib/jupiter/assets";
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
  assetWalletBalance: number | null;
  usdcWalletBalance: number | null;
  assetPriceUsd: number | null;
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
  depositCollateral: (assetAmount: number) => Promise<void>;
  borrow: (usdcAmount: number) => Promise<void>;
  repayDebt: (usdcAmount: number) => Promise<void>;
  repayAllDebt: () => Promise<void>;
  withdrawCollateral: (assetAmount: number) => Promise<void>;
  withdrawAllCollateral: () => Promise<void>;
  refresh: () => void;
}

export function useBorrowData(asset: XStockAsset): BorrowData {
  const { connected, address, signAndSendTransaction, login } = useSigner();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vault, setVault] = useState<LendBorrowVault | null>(null);
  const [position, setPosition] = useState<LendPosition | null>(null);
  const [assetWalletBalance, setAssetWalletBalance] = useState<number | null>(null);
  const [usdcWalletBalance, setUsdcWalletBalance] = useState<number | null>(null);
  const [assetPriceUsd, setAssetPriceUsd] = useState<number | null>(null);
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
      const assetVault =
        vaults.find((v) => v.supplyToken.address === asset.mint && v.borrowToken.address === USDC_MINT) ?? null;
      setVault(assetVault);

      if (assetVault) {
        setAssetPriceUsd(Number(assetVault.supplyToken.price));

        const positionsRes = await fetch(
          `/api/jupiter/lend/positions?users=${encodeURIComponent(address)}`
        );
        if (!positionsRes.ok) {
          throw new Error(await readApiError(positionsRes, "Could not load your position."));
        }
        const positions = (await positionsRes.json()) as LendPosition[];
        setPosition(positions.find((p) => p.vaultId === assetVault.id) ?? null);
      } else {
        setPosition(null);
        const priceRes = await fetch(`/api/jupiter/price?ids=${asset.mint}`);
        const priceData = priceRes.ok ? ((await priceRes.json()) as PriceResponse) : null;
        setAssetPriceUsd(priceData?.[asset.mint]?.usdPrice ?? null);
      }

      const connection = getReadonlyConnection();
      if (connection) {
        const [assetBalance, usdcBalance] = await Promise.all([
          getSplTokenBalance(connection, address, asset.mint),
          getSplTokenBalance(connection, address, USDC_MINT),
        ]);
        setAssetWalletBalance(assetBalance);
        setUsdcWalletBalance(usdcBalance);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your borrow position.");
    } finally {
      setLoading(false);
    }
  }, [address, asset]);

  useEffect(() => {
    if (connected) {
      void Promise.resolve().then(() => load());
    }
  }, [connected, load]);

  const collateralUiAmount = position ? Number(position.supply) / 10 ** asset.decimals : 0;
  const debtUiAmount = position ? Number(position.borrow) / 10 ** USDC_DECIMALS : 0;
  const collateralValueUsd = assetPriceUsd !== null ? collateralUiAmount * assetPriceUsd : 0;
  const debtValueUsd = debtUiAmount; // USDC ≈ $1
  const maxLtv = vault ? Number(vault.collateralFactor) / 1000 : 0;
  const liquidationLtv = vault ? Number(vault.liquidationThreshold) / 1000 : 0;
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

      const simulation = await simulateTransactionBase64(transaction);
      if (!simulation.ok) {
        throw new Error(`This transaction would fail on-chain: ${simulation.error}`);
      }

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

  async function depositCollateral(assetAmount: number): Promise<void> {
    const smallestUnits = Math.round(assetAmount * 10 ** asset.decimals).toString();
    await operate(smallestUnits, "0");
  }

  async function borrow(usdcAmount: number): Promise<void> {
    const smallestUnits = Math.round(usdcAmount * 10 ** USDC_DECIMALS).toString();
    await operate("0", smallestUnits);
  }

  async function repayDebt(usdcAmount: number): Promise<void> {
    const smallestUnits = Math.round(usdcAmount * 10 ** USDC_DECIMALS).toString();
    await operate("0", `-${smallestUnits}`);
  }

  async function repayAllDebt(): Promise<void> {
    await operate("0", LEND_MIN_I128);
  }

  async function withdrawCollateral(assetAmount: number): Promise<void> {
    const smallestUnits = Math.round(assetAmount * 10 ** asset.decimals).toString();
    await operate(`-${smallestUnits}`, "0");
  }

  async function withdrawAllCollateral(): Promise<void> {
    await operate(LEND_MIN_I128, "0");
  }

  return {
    connected,
    onConnect: login,
    loading,
    error,
    rpcConfigured,
    vault,
    position,
    assetWalletBalance,
    usdcWalletBalance,
    assetPriceUsd,
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
    repayDebt,
    repayAllDebt,
    withdrawCollateral,
    withdrawAllCollateral,
    refresh: load,
  };
}
