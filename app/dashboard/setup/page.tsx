import type { Metadata } from "next";
import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import { CalendarIcon } from "@/app/components/icons";

export const metadata: Metadata = {
  title: "Setup — StackNBorrow",
  description: "Create and manage your recurring stock purchase plans.",
};

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];

const ACTIVE_PLANS = [
  {
    ticker: "NVDAx",
    amount: "$20 USDC",
    interval: "Weekly",
    next: "In 3 days",
    status: "Active",
  },
];

export default function SetupPage() {
  return (
    <>
      <DashboardTopBar
        title="Setup"
        subtitle="Create and manage your recurring buy plans."
      />

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.3fr]">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm shadow-slate-900/2">
          <h4 className="text-sm font-semibold text-heading">
            Create a New Plan
          </h4>
          <form className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted">Asset</label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
                <Image
                  src={nvdaxLogo}
                  alt=""
                  width={22}
                  height={23}
                  className="h-5.5 w-5.5"
                />
                <span className="text-sm font-medium text-heading">
                  NVDAx
                </span>
                <span className="text-xs text-faint">
                  NVIDIA Tokenized Stock
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="setup-amount"
                className="text-xs font-medium text-muted"
              >
                Amount (USDC)
              </label>
              <input
                id="setup-amount"
                type="text"
                inputMode="decimal"
                defaultValue="20"
                className="mt-1.5 w-full rounded-xl border border-border bg-page px-4 py-3 text-sm text-heading outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted">
                Frequency
              </label>
              <div className="mt-1.5 flex gap-2">
                {FREQUENCIES.map((freq) => (
                  <span
                    key={freq}
                    className={
                      freq === "Weekly"
                        ? "flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-white"
                        : "flex-1 rounded-xl bg-subtle py-2.5 text-center text-sm font-medium text-muted"
                    }
                  >
                    {freq}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="setup-start"
                className="text-xs font-medium text-muted"
              >
                Start Date
              </label>
              <div className="mt-1.5 flex items-center gap-2.5 rounded-xl border border-border bg-page px-4 py-3">
                <CalendarIcon className="h-4 w-4 shrink-0 text-muted" />
                <input
                  id="setup-start"
                  type="text"
                  defaultValue="Today"
                  className="w-full bg-transparent text-sm text-heading outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Create Plan
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
          <h4 className="text-sm font-semibold text-heading">
            Your Active Plans
          </h4>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-105 text-left text-sm">
              <thead>
                <tr className="text-xs text-faint">
                  <th className="pb-3 pr-2 font-medium">Ticker</th>
                  <th className="pb-3 pr-2 font-medium">Amount</th>
                  <th className="pb-3 pr-2 font-medium">Interval</th>
                  <th className="pb-3 pr-2 font-medium">Next Buy</th>
                  <th className="pb-3 pr-2 font-medium">Status</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {ACTIVE_PLANS.map((plan) => (
                  <tr key={plan.ticker} className="border-t border-border">
                    <td className="whitespace-nowrap py-3.5 pr-2 font-medium text-heading">
                      {plan.ticker}
                    </td>
                    <td className="whitespace-nowrap pr-2 text-muted">
                      {plan.amount}
                    </td>
                    <td className="whitespace-nowrap pr-2 text-muted">
                      {plan.interval}
                    </td>
                    <td className="whitespace-nowrap pr-2 text-muted">
                      {plan.next}
                    </td>
                    <td className="pr-2">
                      <span className="whitespace-nowrap rounded-full bg-success-bg px-2.5 py-1 text-xs font-medium text-success-text">
                        {plan.status}
                      </span>
                    </td>
                    <td>
                      <button className="whitespace-nowrap rounded-lg bg-subtle px-3 py-1.5 text-xs font-medium text-muted">
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
