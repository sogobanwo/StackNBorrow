import type { Metadata } from "next";
import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import minichartGrowth from "@/public/illustrations/minichart-growth.png";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import { TrendUpIcon } from "@/app/components/icons";

export const metadata: Metadata = {
  title: "Portfolio — StackNBorrow",
  description: "Track your holdings and performance over time.",
};

const PORTFOLIO_STATS: { label: string; value: string; change?: string }[] = [
  { label: "Total Invested", value: "$480.00" },
  { label: "Current Value", value: "$523.05", change: "+8.9%" },
  { label: "All-Time Return", value: "+$43.05", change: "+8.9%" },
  { label: "Holdings", value: "1 asset" },
];

export default function PortfolioPage() {
  return (
    <>
      <DashboardTopBar
        title="Portfolio"
        subtitle="Track your holdings and performance over time."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PORTFOLIO_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/2"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            <p className="mt-2 text-lg font-semibold text-heading">
              {stat.value}
            </p>
            {stat.change && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
                <TrendUpIcon className="h-3 w-3" />
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <h4 className="text-sm font-semibold text-heading">
              Your Holdings
            </h4>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-120 text-left text-sm">
                <thead>
                  <tr className="text-xs text-faint">
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium">Balance</th>
                    <th className="pb-3 font-medium">USD Value</th>
                    <th className="pb-3 font-medium">24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="flex items-center gap-2.5 py-3.5">
                      <Image
                        src={nvdaxLogo}
                        alt=""
                        width={24}
                        height={25}
                        className="h-6.25 w-6"
                      />
                      <span>
                        <span className="block font-medium text-heading">
                          NVDAx
                        </span>
                        <span className="block text-xs text-faint">
                          NVIDIA Tokenized Stock
                        </span>
                      </span>
                    </td>
                    <td className="text-muted">2.3847 NVDAx</td>
                    <td className="text-muted">$523.05</td>
                    <td className="font-medium text-emerald-500">+6.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <h4 className="text-sm font-semibold text-heading">
              Order History
            </h4>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-105 text-left text-sm">
                <thead>
                  <tr className="text-xs text-faint">
                    <th className="pb-3 pr-2 font-medium">Ticker</th>
                    <th className="pb-3 pr-2 font-medium">Amount</th>
                    <th className="pb-3 pr-2 font-medium">Interval</th>
                    <th className="pb-3 pr-2 font-medium">Period</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="whitespace-nowrap py-3.5 pr-2 font-medium text-heading">
                      NVDAx
                    </td>
                    <td className="whitespace-nowrap pr-2 text-muted">$80.00</td>
                    <td className="whitespace-nowrap pr-2 text-muted">Weekly</td>
                    <td className="whitespace-nowrap pr-2 text-muted">Apr 12 – May 20</td>
                    <td className="whitespace-nowrap font-medium text-muted">
                      Completed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-faint">Portfolio Value</p>
            <span className="flex items-center gap-1 rounded-full bg-success-bg px-2 py-1 text-xs font-medium text-success-text">
              <TrendUpIcon className="h-3 w-3" />
              +8.9%
            </span>
          </div>
          <p className="text-lg font-semibold text-heading">$523.05</p>
          <Image
            src={minichartGrowth}
            alt=""
            width={280}
            height={96}
            className="mt-3 h-auto w-full"
          />
          <p className="mt-3 text-xs text-faint">Last 30 days</p>
        </div>
      </div>
    </>
  );
}
