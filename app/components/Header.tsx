import Image from "next/image";
import Link from "next/link";
import logoIcon from "@/public/illustrations/logo-icon.png";

const NAV_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F6F7FB] border-b border-border">
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

        <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition-colors hover:bg-primary-dark">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}
