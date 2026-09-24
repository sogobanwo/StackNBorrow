"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSigner } from "@/lib/wallet/useSigner";

export default function ConnectWalletButton({ className }: { className: string }) {
  const router = useRouter();
  const { ready, connected, address, login } = useSigner();

  useEffect(() => {
    if (connected) {
      router.push("/home");
    }
  }, [connected, router]);

  function handleClick() {
    if (connected) {
      router.push("/home");
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
