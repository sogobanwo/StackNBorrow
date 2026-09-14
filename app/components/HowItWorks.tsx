import Image from "next/image";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import minichartGrowth from "@/public/illustrations/minichart-growth.png";
import howitworks1 from "@/public/illustrations/howitworks-1-illustration.png";
import howitworks2 from "@/public/illustrations/howitworks-2-illustration.png";
import howitworks3a from "@/public/illustrations/howitworks-3-illustration-a.png";
import howitworks3b from "@/public/illustrations/howitworks-3-illustration-b.png";
import { TrendUpIcon } from "./icons";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#e4e7f2]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 py-16 sm:px-10 md:grid-cols-3 lg:px-[116px] lg:py-20">
        {/* Card 1 */}
        <div className="rounded-3xl bg-subtle p-6 lg:p-7">
          <h3 className="text-lg font-semibold text-heading">
            1. Set Up Your DCA Plan
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Choose a stock, amount and schedule. Jupiter handles the rest.
          </p>

          <div className="relative mt-6">
            <div className="relative z-10 w-[70%] min-w-[160px] rounded-2xl bg-card p-4 shadow-sm shadow-slate-900/[0.03] lg:w-[65%]">
              <div className="flex items-center gap-2 text-sm font-medium text-heading">
                <Image
                  src={nvdaxLogo}
                  alt=""
                  width={20}
                  height={21}
                  className="h-[21px] w-[20px]"
                />
                NVDAx
              </div>
              <div className="mt-3 rounded-lg bg-subtle px-3 py-2 text-xs text-muted">
                $50
              </div>
              <div className="mt-2 rounded-lg bg-subtle px-3 py-2 text-xs text-muted">
                Weekly
              </div>
              <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">
                Create Plan
              </button>
            </div>
            
            <Image
              src={howitworks1}
              alt=""
              width={160}
              height={200}
              className="absolute -right-4 top-1/2 z-20 w-[110px] -translate-y-1/2 object-contain sm:-right-2 lg:-right-8 lg:w-[150px]"
            />
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl bg-subtle p-6 lg:p-7">
          <h3 className="text-lg font-semibold text-heading">
            2. Watch It Grow
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Track your position, order history and total value — all in one
            place.
          </p>

          <div className="relative mt-6">
            <div className="relative z-10 w-[70%] min-w-[160px] rounded-2xl bg-card p-4 shadow-sm shadow-slate-900/[0.03] lg:w-[65%]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-faint">Portfolio Value</p>
                  <p className="text-base font-semibold text-heading">
                    $822.36
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-success-bg px-2 py-1 text-[10px] font-medium text-success-text sm:text-xs">
                  <TrendUpIcon className="h-3 w-3" />
                  +8.3%
                </span>
              </div>
              <Image
                src={minichartGrowth}
                alt=""
                width={146}
                height={50}
                className="mt-3 h-auto w-full"
              />
            </div>
            
            <Image
              src={howitworks2}
              alt=""
              width={120}
              height={160}
              className="absolute -right-4 bottom-0 z-20 w-[100px] object-contain sm:-right-2 lg:-right-8 lg:-bottom-2 lg:w-[130px]"
            />
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-3xl bg-subtle p-6 lg:p-7">
          <h3 className="text-lg font-semibold text-heading">
            3. Borrow Against It
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Deposit your stock as collateral and borrow USDC — without
            selling.
          </p>

          <div className="relative mt-6">
            <div className="relative z-10 w-[70%] min-w-[160px] rounded-2xl bg-card p-4 shadow-sm shadow-slate-900/[0.03] lg:w-[65%]">
              <p className="text-xs text-faint">Borrow USDC</p>
              <p className="text-base font-semibold text-heading">$200</p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-subtle">
                <div className="h-1.5 w-2/3 rounded-full bg-primary" />
              </div>
              <p className="mt-1.5 text-xs text-faint">Max LTV 70%</p>
              <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-white">
                Borrow
              </button>
            </div>
            
            <div className="absolute -right-6 top-1/2 z-20 w-[120px] -translate-y-1/2 sm:-right-4 lg:-right-12 lg:w-[160px]">
              <Image
                src={howitworks3a}
                alt=""
                width={160}
                height={160}
                className="h-auto w-full object-contain"
              />
              <Image
                src={howitworks3b}
                alt=""
                width={70}
                height={80}
                className="absolute right-8 w-12.5 top-0 sm:right-4 lg:right-1 lg:top-20 lg:w-17.5"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
