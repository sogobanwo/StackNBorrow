import Image from "next/image";
import dashboardIllustration from "@/public/illustrations/dashboard-illustration.png";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import streakIllustration from "@/public/illustrations/streak-illustration.png";
import logoIcon from "@/public/illustrations/logo-icon.png";
import {
  BellIcon,
  BorrowIcon,
  CalendarIcon,
  FireIcon,
  HomeIcon,
  PortfolioIcon,
  RefreshIcon,
  SetupIcon,
  TrendUpIcon,
} from "./icons";

const STATS = [
  { label: "Total Invested", value: "$480.00", change: "+18.5%" },
  { label: "Current Value", value: "$322.36", change: "+8.7%" },
  { label: "Active Orders", value: "2", change: null },
  { label: "Available USDC", value: "$42.17", change: null },
];

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Setup", icon: SetupIcon },
  { label: "Portfolio", icon: PortfolioIcon },
  { label: "Borrow", icon: BorrowIcon },
];

export default function DashboardShowcase() {
  return (
    <section className="relative bg-[#e4e7f2]">
      <div className="mx-auto max-w-360 px-6 sm:px-10 lg:px-29">
        <div className="relative overflow-hidden rounded-4xl bg-[#e4e7f2] pt-12">
          <div className="relative hidden items-center lg:flex lg:min-h-80">
            <Image
              src={dashboardIllustration}
              alt="3D illustration of the StackNBorrow position: stacked blocks, an NVDAx card and a growth arrow"
              fill
              className="object-cover object-right rounded-t-4xl"
              sizes="1440px"
            />
            <div className="relative z-10 max-w-[50%] px-12 py-14 xl:max-w-xl xl:px-16">
              <p className="text-sm font-medium tracking-[0.2em] text-muted uppercase">
                Your Portfolio, In One Place
              </p>
              <h2 className="mt-4 text-[42px] font-bold leading-[1.1] text-heading xl:text-[48px]">
                Build.Track.Borrow.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                Simple, powerful tools to help you grow your position and
                access liquidity - on your terms.
              </p>
            </div>
          </div>

          {/* Mobile/tablet: stacked text + contained illustration */}
          <div className="px-6 pb-10 pt-14 sm:px-10 lg:hidden">
            <p className="text-sm font-medium tracking-[0.2em] text-muted uppercase">
              Your Portfolio, In One Place
            </p>
            <h2 className="mt-4 text-[26px] font-bold leading-[1.1] text-heading sm:text-[36px]">
              Build.Track.Borrow.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
              Simple, powerful tools to help you grow your position and
              access liquidity - on your terms.
            </p>
            <div className="relative mx-auto mt-6 h-[200px] w-full max-w-[520px] sm:h-[240px]">
              <Image
                src={dashboardIllustration}
                alt="3D illustration of the StackNBorrow position: stacked blocks, an NVDAx card and a growth arrow"
                fill
                className="object-contain object-right"
                sizes="520px"
              />
            </div>
          </div>

          {/* App mockup */}
          <div className="relative -top-12 z-10 overflow-hidden rounded-b-3xl bg-card shadow-[0_-20px_60px_-15px_rgba(30,40,80,0.15)]">
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar */}
              <aside className="flex shrink-0 flex-col justify-between border-b border-border bg-card px-6 py-7 lg:w-[240px] lg:border-b-0 lg:border-r">
                <div>
                  <div className="flex items-center gap-2">
                    <Image
                      src={logoIcon}
                      alt=""
                      width={20}
                      height={21}
                      className="h-[21px] w-[20px]"
                    />
                    <span className="text-sm font-semibold text-heading">
                      StackNBorrow
                    </span>
                  </div>
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
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-heading">
                      Welcome back, Alex
                    </h3>
                    <p className="text-sm text-muted">
                      Your stack is growing. Keep it up!
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-medium text-slate-300">
                      Dark Mode
                      <span className="flex h-4 w-7 items-center rounded-full bg-primary p-0.5">
                        <span className="h-3 w-3 rounded-full bg-white" />
                      </span>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted">
                      <BellIcon className="h-4 w-4" />
                    </span>
                    <span className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-indigo-400" />
                  </div>
                </div>

                {/* Stat cards */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border/60 bg-card px-4 py-4 shadow-sm shadow-slate-900/[0.02]"
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

                {/* Tables + side panel */}
                <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
                  <div className="min-w-0 space-y-5">
                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/[0.02]">
                      <h4 className="text-sm font-semibold text-heading">
                        Your Holdings
                      </h4>
                      <div className="mt-4 overflow-x-auto">
                        <table className="w-full min-w-[480px] text-left text-sm">
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
                                  className="h-[25px] w-[24px]"
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
                              <td className="font-medium text-emerald-500">
                                +6.7%
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/[0.02]">
                      <h4 className="text-sm font-semibold text-heading">
                        Active Orders
                      </h4>
                      <div className="mt-4 min-w-0 overflow-x-auto">
                        <table className="w-full min-w-[420px] text-left text-sm">
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

                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/[0.02]">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-heading">
                          Order History
                        </h4>
                        <span className="text-xs font-medium text-primary">
                          View all
                        </span>
                      </div>
                      <div className="mt-4 min-w-0 overflow-x-auto">
                        <table className="w-full min-w-[420px] text-left text-sm">
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
                    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm shadow-slate-900/[0.02]">
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
                      <div className="relative bg-gradient-to-br from-streak-from to-streak-to p-5">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-amber-900/70">
                            Your Streak
                          </p>
                          <TrophyIconBadge />
                        </div>
                        <p className="mt-3 flex items-center gap-1.5 text-2xl font-bold text-amber-900">
                          <FireIcon className="h-5 w-5 text-orange-500" />
                          4 weeks
                        </p>
                        <p className="mt-1 text-xs text-amber-900/60">
                          Keep going! You&apos;re on a roll.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrophyIconBadge() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-amber-600">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
        <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 13v3M9 20h6M10 17h4v3h-4z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
