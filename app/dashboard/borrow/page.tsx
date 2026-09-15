import type { Metadata } from "next";
import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";

export const metadata: Metadata = {
  title: "Borrow — StackNBorrow",
  description:
    "Use your stock holdings as collateral and borrow USDC without selling.",
};

const BORROW_STATS = [
  { label: "Collateral Value", value: "$523.05" },
  { label: "Borrowing Power", value: "$366.14" },
  { label: "Current Debt", value: "$0.00" },
  { label: "Health Factor", value: "—" },
];

export default function BorrowPage() {
  return (
    <>
      <DashboardTopBar
        title="Borrow"
        subtitle="Use your stock holdings as collateral and borrow USDC — without selling."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {BORROW_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/2"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold text-heading">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
          <h4 className="text-sm font-semibold text-heading">Borrow USDC</h4>

          <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
            <Image
              src={nvdaxLogo}
              alt=""
              width={22}
              height={23}
              className="h-5.5 w-5.5"
            />
            <div>
              <p className="text-sm font-medium text-heading">
                NVDAx collateral
              </p>
              <p className="text-xs text-faint">2.3847 NVDAx · $523.05</p>
            </div>
          </div>

          <label
            htmlFor="borrow-amount"
            className="mt-5 block text-xs font-medium text-muted"
          >
            Amount to borrow (USDC)
          </label>
          <input
            id="borrow-amount"
            type="text"
            inputMode="decimal"
            defaultValue="200"
            className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-faint">
              <span>Loan-to-Value</span>
              <span>70% max</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-subtle">
              <div className="h-2 w-[54%] rounded-full bg-primary" />
            </div>
            <p className="mt-1.5 text-xs text-faint">
              Borrowing $200 against $523.05 collateral · 38% LTV
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Borrow USDC
          </button>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
          <h4 className="text-sm font-semibold text-heading">
            Active Borrows
          </h4>
          <div className="mt-10 flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm font-medium text-heading">
              No active borrows yet
            </p>
            <p className="mt-1 max-w-56 text-xs text-faint">
              Borrow against your NVDAx position to see it listed here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
