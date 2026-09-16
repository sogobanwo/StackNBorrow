"use client";

import { createContext, useContext } from "react";
import { useWalletModalState, type WalletModalState } from "@solana/react-hooks";
import WalletPickerDialog from "@/app/components/wallet/WalletPickerDialog";

const WalletModalContext = createContext<WalletModalState | null>(null);

export function WalletModalProvider({ children }: { children: React.ReactNode }) {
  const state = useWalletModalState({ closeOnConnect: true });

  return (
    <WalletModalContext.Provider value={state}>
      {children}
      {state.isOpen && <WalletPickerDialog state={state} />}
    </WalletModalContext.Provider>
  );
}

/** One shared wallet-connect modal for the whole app — every "Connect Wallet" entry point opens the same instance. */
export function useWalletModal(): WalletModalState {
  const context = useContext(WalletModalContext);
  if (!context) {
    throw new Error("useWalletModal must be used within WalletModalProvider");
  }
  return context;
}
