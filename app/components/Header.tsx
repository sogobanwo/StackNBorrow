"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logoIcon from "@/public/illustrations/logo-icon.png";
import ConnectWalletButton from "./ConnectWalletButton";

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        scrolled
          ? "sticky top-0 z-50 backdrop-blur-md bg-[#F6F7FB] border-b border-border shadow-sm shadow-slate-900/5 transition-shadow"
          : "sticky top-0 z-50 backdrop-blur-md bg-[#F6F7FB] border-b border-border shadow-none transition-shadow"
      }
    >
      <div className="mx-auto flex max-w-360 items-center justify-between px-6 py-5 sm:px-10 lg:px-29">
        <Link href="#" className="flex items-center gap-2.5">
          <Image
            src={logoIcon}
            alt=""
            width={30}
            height={31}
            className="h-7.75 w-7.5"
            priority
          />
          <span className="text-xl font-bold text-heading">StackNBorrow</span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "text-sm font-medium text-primary"
                  : "text-sm font-medium text-muted transition-colors hover:text-heading"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ConnectWalletButton className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-colors hover:bg-primary-dark disabled:opacity-60" />
      </div>
    </header>
  );
}
