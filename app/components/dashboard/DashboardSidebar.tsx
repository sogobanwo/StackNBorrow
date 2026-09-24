"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import logoIcon from "@/public/illustrations/logo-icon.png";
import {
  BorrowIcon,
  CloseIcon,
  CoinsIcon,
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  PortfolioIcon,
  RefreshIcon,
  SetupIcon,
} from "../icons";
import { useSigner } from "@/lib/wallet/useSigner";
import { gsap } from "@/lib/motion/gsap";

const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: HomeIcon },
  { label: "Buy Stocks", href: "/buy", icon: RefreshIcon },
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pathnameForDrawer, setPathnameForDrawer] = useState(pathname);
  if (pathname !== pathnameForDrawer) {
    setPathnameForDrawer(pathname);
    setMobileOpen(false);
  }

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

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const accountStatus = (
    <button
      type="button"
      onClick={handleLogout}
      disabled={!connected}
      className="flex w-full items-center justify-between gap-3 rounded-xl bg-subtle px-4 py-3 text-left transition-colors hover:bg-border disabled:opacity-60"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={
            connected ? "h-2 w-2 shrink-0 rounded-full bg-emerald-500" : "h-2 w-2 shrink-0 rounded-full bg-faint"
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
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-card px-6 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoIcon} alt="" width={20} height={21} className="h-5.25 w-5" />
          <span className="text-sm font-semibold text-heading">StackNBorrow</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-muted hover:bg-subtle"
          aria-label="Open menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer — always mounted so open/close can transition both ways, not just pop in/out */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col justify-between bg-card px-6 py-7 shadow-xl transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Image src={logoIcon} alt="" width={20} height={21} className="h-5.25 w-5" />
                <span className="text-sm font-semibold text-heading">StackNBorrow</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-muted hover:bg-subtle"
                aria-label="Close menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
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
          <div className="mt-10">{accountStatus}</div>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 flex-col justify-between border-r border-border bg-card px-6 py-7 lg:flex lg:w-60">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoIcon} alt="" width={20} height={21} className="h-5.25 w-5" />
            <span className="text-sm font-semibold text-heading">StackNBorrow</span>
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
        <div className="mt-10">{accountStatus}</div>
      </aside>
    </>
  );
}
