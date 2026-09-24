"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import logoIcon from "@/public/illustrations/logo-icon.png";
import { BorrowIcon, CoinsIcon, LogoutIcon, PortfolioIcon, SetupIcon } from "../icons";
import { useSigner } from "@/lib/wallet/useSigner";
import { gsap } from "@/lib/motion/gsap";

const NAV_ITEMS = [
  { label: "Setup", href: "/setup", icon: SetupIcon },
  { label: "Portfolio", href: "/portfolio", icon: PortfolioIcon },
  { label: "Borrow", href: "/borrow", icon: BorrowIcon },
  { label: "Pre-IPO", href: "/prestocks", icon: CoinsIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { connected, address, logout } = useSigner();
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const hasPositionedPill = useRef(false);

  useEffect(() => {
    const activeEl = itemRefs.current[pathname];
    if (!activeEl || !pillRef.current || !navRef.current) return;

    const navBox = navRef.current.getBoundingClientRect();
    const itemBox = activeEl.getBoundingClientRect();
    const vars = {
      x: itemBox.left - navBox.left,
      y: itemBox.top - navBox.top,
      width: itemBox.width,
      height: itemBox.height,
    };

    if (!hasPositionedPill.current) {
      gsap.set(pillRef.current, vars);
      hasPositionedPill.current = true;
    } else {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.to(pillRef.current, { ...vars, duration: prefersReducedMotion ? 0 : 0.4, ease: "power3.out" });
    }
  }, [pathname]);

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
        <nav ref={navRef} className="relative mt-8 flex flex-col gap-1.5">
          <div ref={pillRef} className="absolute top-0 left-0 rounded-xl bg-primary" />
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                ref={(el) => {
                  itemRefs.current[item.href] = el;
                }}
                className={
                  active
                    ? "relative z-10 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                    : "relative z-10 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-subtle hover:text-heading"
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
