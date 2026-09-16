"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logoIcon from "@/public/illustrations/logo-icon.png";
import { BorrowIcon, LogoutIcon, PortfolioIcon, SetupIcon } from "../icons";
import { useSigner } from "@/lib/wallet/useSigner";

const NAV_ITEMS = [
  { label: "Setup", href: "/setup", icon: SetupIcon },
  { label: "Portfolio", href: "/portfolio", icon: PortfolioIcon },
  { label: "Borrow", href: "/borrow", icon: BorrowIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { connected, address, logout } = useSigner();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <aside className="flex shrink-0 flex-col justify-between border-b border-border bg-card px-6 py-7 lg:w-60 lg:border-b-0 lg:border-r">
      <div>
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoIcon} alt="" width={20} height={21} className="h-5.25 w-5" />
          <span className="text-sm font-semibold text-heading">
            StackNBorrow
          </span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={
                  active
                    ? "flex items-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
                    : "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-subtle hover:text-heading"
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={!connected}
        className="mt-10 flex items-center justify-between rounded-xl px-1 py-3 text-left transition-colors hover:bg-subtle disabled:opacity-60"
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={
              connected
                ? "h-2 w-2 shrink-0 rounded-full bg-emerald-500"
                : "h-2 w-2 shrink-0 rounded-full bg-faint"
            }
          />
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-muted">
              {connected ? (
                <>
                  Connected{" "}
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                    Solana
                  </span>
                </>
              ) : (
                "Not connected"
              )}
            </p>
            <p className="truncate text-xs text-faint">
              {connected && address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "—"}
            </p>
          </div>
        </div>
        <LogoutIcon className="h-4 w-4 shrink-0 text-muted" />
      </button>
    </aside>
  );
}
