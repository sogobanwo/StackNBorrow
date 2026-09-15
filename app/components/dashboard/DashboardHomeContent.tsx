import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import streakIllustration from "@/public/illustrations/streak-illustration.png";
import {
  CalendarIcon,
  FireIcon,
  OrdersIcon,
  RefreshIcon,
  TrendUpIcon,
} from "../icons";
import DashboardTopBar from "./DashboardTopBar";

const STATS: {
  label: string;
  value?: string;
  change?: string | null;
  icon?: typeof OrdersIcon;
}[] = [
  { label: "Total Invested", value: "$480.00", change: "+18.5%" },
  { label: "Current Value", value: "$322.36", change: "+8.7%" },
  { label: "Active Orders", icon: OrdersIcon },
  { label: "Available USDC", value: "$42.17", change: null },
];

export default function DashboardHomeContent() {
  return (
    <>
      <DashboardTopBar
        title="Welcome back, Alex"
        subtitle="Your stack is growing. Keep it up!"
      />

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/2"
          >
            <p className="text-xs text-muted">{stat.label}</p>
            {stat.icon ? (
              <stat.icon className="mt-2 h-5 w-5 text-primary" />
            ) : (
              <p className="mt-2 text-lg font-semibold text-heading">
                {stat.value}
              </p>
            )}
            {stat.change && (
              <p className="mt-1 flex items-center gap-1 text-xs font-medium text-emerald-500">
                <TrendUpIcon className="h-3 w-3" />
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tables + side panel */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
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
              Active Orders
            </h4>
            <div className="mt-4 min-w-0 overflow-x-auto">
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
                  <tr className="border-t border-border">
                    <td className="whitespace-nowrap py-3.5 pr-2 font-medium text-heading">
                      NVDAx
                    </td>
                    <td className="whitespace-nowrap pr-2 text-muted">$20 USDC</td>
                    <td className="whitespace-nowrap pr-2 text-muted">Weekly</td>
                    <td className="whitespace-nowrap pr-2 text-muted">In 3 days</td>
                    <td className="pr-2">
                      <span className="whitespace-nowrap rounded-full bg-success-bg px-2.5 py-1 text-xs font-medium text-success-text">
                        Active
                      </span>
                    </td>
                    <td>
                      <button className="whitespace-nowrap rounded-lg bg-subtle px-3 py-1.5 text-xs font-medium text-muted">
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-heading">
                Order History
              </h4>
              <span className="text-xs font-medium text-primary">
                View all
              </span>
            </div>
            <div className="mt-4 min-w-0 overflow-x-auto">
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

        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/2">
            <h4 className="text-sm font-semibold text-heading">
              Quick Actions
            </h4>
            <div className="mt-4 space-y-3">
              <button className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-heading">
                    Buy Now
                  </span>
                  <span className="block text-xs text-faint">
                    One time purchase
                  </span>
                </span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl bg-primary/5 px-4 py-3 text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-heading">
                    Create Recurring Plan
                  </span>
                  <span className="block text-xs text-faint">
                    Set up automatic buys
                  </span>
                </span>
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={streakIllustration}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
            <div className="relative bg-linear-to-br from-streak-from to-streak-to p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-amber-900/70">
                  Your Streak
                </p>
                <RibbonIconBadge />
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-2xl font-bold text-amber-900">
                <FireIcon className="h-5 w-5 text-orange-500" />
                4 weeks
              </p>
              <p className="mt-1 text-xs text-amber-900/60">
                Keep going! You&apos;re on a roll.
              </p>
              <MiniStreakChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RibbonIconBadge() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
        <circle cx="12" cy="8" r="5" />
        <path d="M9 12.5 7 21l5-2.5L17 21l-2-8.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const STREAK_BARS = [30, 45, 65, 85, 100];

function MiniStreakChart() {
  return (
    <div className="mt-4 flex items-end gap-1">
      {STREAK_BARS.map((height, i) => (
        <span
          key={i}
          style={{ height: `${height * 0.28}px` }}
          className={
            i % 2 === 0
              ? "w-2.5 rounded-full bg-primary/50"
              : "w-2.5 rounded-full bg-amber-400/70"
          }
        />
      ))}
    </div>
  );
}
