"use client";

import { useRouter } from "next/navigation";
import { useSigner } from "@/lib/wallet/useSigner";

export default function ConnectWalletButton({ className }: { className: string }) {
  const router = useRouter();
  const { ready, connected, address, login } = useSigner();

  function handleClick() {
    if (connected) {
      router.push("/portfolio");
      return;
    }
    login();
  }

  const label = connected && address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : "Get Started";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!ready}
      className={className}
    >
      {label}
    </button>
  );
}
