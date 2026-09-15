import Image from "next/image";
import Link from "next/link";
import logoIcon from "@/public/illustrations/logo-icon.png";
import { BorrowIcon, HomeIcon, PortfolioIcon, SetupIcon } from "../icons";
import DashboardHomeContent from "./DashboardHomeContent";

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Setup", icon: SetupIcon },
  { label: "Portfolio", icon: PortfolioIcon },
  { label: "Borrow", icon: BorrowIcon },
];

export default function DashboardApp({
  fullHeight = false,
}: {
  fullHeight?: boolean;
}) {
  return (
    <div className={`flex flex-col lg:flex-row ${fullHeight ? "lg:min-h-screen" : ""}`}>
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col justify-between border-b border-border bg-card px-6 py-7 lg:w-60 lg:border-b-0 lg:border-r">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Image src={logoIcon} alt="" width={20} height={21} className="h-5.25 w-5" />
            <span className="text-sm font-semibold text-heading">
              StackNBorrow
            </span>
          </Link>
          <nav className="mt-8 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className={
                  item.active
                    ? "flex items-center gap-3 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white"
                    : "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-muted"
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex items-center justify-between rounded-xl px-1 py-3">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-muted">
                Connected{" "}
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                  Solana
                </span>
              </p>
              <p className="truncate text-xs text-faint">1F3a...8HL2</p>
            </div>
          </div>
          <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 bg-card px-6 py-7 sm:px-8">
        <DashboardHomeContent />
      </div>
    </div>
  );
}
