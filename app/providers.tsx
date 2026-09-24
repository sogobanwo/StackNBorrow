"use client";

import { autoDiscover, createClient } from "@solana/client";
import { SolanaProvider } from "@solana/react-hooks";
import { WalletModalProvider } from "@/app/components/wallet/WalletModalProvider";
import SmoothScroll from "@/lib/motion/SmoothScroll";

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

const solanaClient = createClient(
  rpcUrl
    ? { endpoint: rpcUrl, walletConnectors: autoDiscover() }
    : { cluster: "mainnet", walletConnectors: autoDiscover() }
);

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProvider client={solanaClient}>
      <WalletModalProvider>
        <SmoothScroll>{children}</SmoothScroll>
      </WalletModalProvider>
    </SolanaProvider>
  );
}
