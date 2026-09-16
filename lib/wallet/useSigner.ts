"use client";

import { useCallback } from "react";
import { fromVersionedTransaction } from "@solana/compat";
import { getBase64EncodedWireTransaction, type SendableTransaction, type Transaction } from "@solana/kit";
import { VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { useWalletModal } from "@/app/components/wallet/WalletModalProvider";
import { withTimeout } from "@/lib/timeout";

const WALLET_ACTION_TIMEOUT_MS = 60000; // generous — a human has to notice and act on the wallet popup

// @solana/client's wallet.signTransaction/sendTransaction type an input transaction as already
// "fully signed" — a quirk of the (experimental) package's types, not a real runtime requirement;
// the wallet is precisely what adds that missing signature, so this cast just satisfies the brand.
function asSendable(transaction: Transaction): SendableTransaction & Transaction {
  return transaction as SendableTransaction & Transaction;
}

export interface StackSigner {
  ready: boolean;
  connected: boolean;
  address: string | null;
  login: () => void;
  logout: () => void;
  /** Sign a UTF-8 text challenge, returning a base58-encoded signature (Jupiter Trigger auth). */
  signMessage: (message: string) => Promise<string>;
  /** Sign a base64 transaction without broadcasting it; returns the signed tx as base64. */
  signTransaction: (base64Tx: string) => Promise<string>;
  /** Sign and broadcast a base64 transaction; returns the network signature (base58). */
  signAndSendTransaction: (base64Tx: string) => Promise<string>;
}

/**
 * One signer interface for every transaction flow, backed by any Wallet Standard wallet
 * (Phantom, Solflare, ...) discovered via @solana/client's autoDiscover().
 */
export function useSigner(): StackSigner {
  const { wallet, connected, isReady, open, disconnect } = useWalletModal();

  const signMessage = useCallback(
    async (message: string): Promise<string> => {
      if (!wallet?.signMessage) {
        throw new Error("This wallet does not support message signing");
      }
      const signature = await withTimeout(
        wallet.signMessage(new TextEncoder().encode(message)),
        WALLET_ACTION_TIMEOUT_MS,
        "Signature request timed out — check your wallet for a pending prompt."
      );
      return bs58.encode(signature);
    },
    [wallet]
  );

  const signTransaction = useCallback(
    async (base64Tx: string): Promise<string> => {
      if (!wallet?.signTransaction) {
        throw new Error("This wallet does not support signing without sending");
      }
      const legacyTx = VersionedTransaction.deserialize(Buffer.from(base64Tx, "base64"));
      const signed = await withTimeout(
        wallet.signTransaction(asSendable(fromVersionedTransaction(legacyTx))),
        WALLET_ACTION_TIMEOUT_MS,
        "Signature request timed out — check your wallet for a pending prompt."
      );
      return getBase64EncodedWireTransaction(signed);
    },
    [wallet]
  );

  const signAndSendTransaction = useCallback(
    async (base64Tx: string): Promise<string> => {
      if (!wallet?.sendTransaction) {
        throw new Error("This wallet does not support sending transactions");
      }
      const legacyTx = VersionedTransaction.deserialize(Buffer.from(base64Tx, "base64"));
      const signature = await withTimeout(
        wallet.sendTransaction(asSendable(fromVersionedTransaction(legacyTx))),
        WALLET_ACTION_TIMEOUT_MS,
        "Signature request timed out — check your wallet for a pending prompt."
      );
      return signature;
    },
    [wallet]
  );

  return {
    ready: isReady,
    connected,
    address: wallet?.account.address ?? null,
    login: open,
    logout: disconnect,
    signMessage,
    signTransaction,
    signAndSendTransaction,
  };
}
