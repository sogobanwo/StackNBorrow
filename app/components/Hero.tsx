import Image from "next/image";
import heroBg from "@/public/illustrations/hero-bg.png";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import { CalendarIcon, DollarCircleIcon, PlayIcon } from "./icons";

function FloatingCards() {
  return (
    <>
      <div className="absolute left-[51%] top-[49%] flex items-center gap-2.5 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-lg shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarIcon className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap text-xs font-medium text-body">
          Auto Buy
          <br />
          <span className="text-heading">$20 monthly</span>
        </span>
      </div>

      <div className="absolute left-[80%] top-[41%] flex items-center gap-2.5 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-lg shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur">
        <Image
          src={nvdaxLogo}
          alt=""
          width={28}
          height={29}
          className="h-[29px] w-[28px] rounded-full"
        />
        <span className="whitespace-nowrap text-xs font-medium text-body">
          Build Position
          <br />
          <span className="font-semibold text-heading">NVDAx ↗</span>
        </span>
      </div>

      <div className="absolute left-[79%] top-[56%] flex items-center gap-2.5 rounded-2xl bg-white/90 px-3.5 py-2.5 shadow-lg shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <DollarCircleIcon className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap text-xs font-medium text-body">
          Borrow
          <br />
          <span className="text-heading">USDC</span>
        </span>
      </div>
    </>
  );
}

const HERO_BG_FADE_MASK =
  "radial-gradient(ellipse 95% 92% at 58% 50%, black 60%, transparent 100%)";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#e4e7f2]">
      <div className="relative mx-auto max-w-360 px-6 sm:px-10 lg:px-29">
        {/* Full-bleed illustration background (desktop): matches the design's
            single background image which spans the whole hero row, mostly
            blank behind the text column and illustrated on the right. */}
        <div
          className="pointer-events-none absolute inset-x-6 top-1/2 hidden -translate-y-1/2 sm:inset-x-10 lg:inset-x-29 lg:block"
          style={{ aspectRatio: "960 / 404" }}
        >
          <Image
            src={heroBg}
            alt="StackNBorrow app showing an automated NVDAx stock position, next to a recurring-buy calendar and borrowable USDC coins"
            fill
            className="object-contain"
            style={{
              maskImage: HERO_BG_FADE_MASK,
              WebkitMaskImage: HERO_BG_FADE_MASK,
            }}
            sizes="1440px"
            priority
          />
          <FloatingCards />
        </div>

        <div className="relative z-10 grid grid-cols-1 items-center gap-12 py-8 lg:grid-cols-2 lg:gap-8 lg:py-16">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-faint uppercase">
              Invest &bull; Automate &bull; Borrow
            </p>
            <h1 className="mt-4 text-[42px] font-bold leading-[1.1] text-heading sm:text-[52px]">
              Stack stocks.
              <br />
              Borrow against them.
              <br />
              Never sell.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-body">
              Automate recurring stock buys on Solana, then borrow against
              your position instead of selling when you need cash — all
              powered by Jupiter&apos;s existing infrastructure.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button className="rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary-dark">
                Get Started
              </button>
              <button className="flex items-center gap-2.5 rounded-2xl bg-subtle px-7 py-4 text-base font-semibold text-body transition-colors hover:bg-border">
                <PlayIcon className="h-4 w-4" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* Mobile/tablet illustration: simple contained image, no
              precisely-positioned floating cards (those are a desktop
              refinement over the full-bleed background above). */}
          <div className="relative mx-auto h-[260px] w-full max-w-[520px] sm:h-[320px] lg:hidden">
            <Image
              src={heroBg}
              alt="StackNBorrow app showing an automated NVDAx stock position, next to a recurring-buy calendar and borrowable USDC coins"
              fill
              className="object-contain object-right"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
