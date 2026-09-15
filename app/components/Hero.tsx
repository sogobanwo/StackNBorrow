import Image from "next/image";
import heroBg from "@/public/illustrations/hero-bg.png";
import nvdaxLogo from "@/public/illustrations/nvdax-logo.png";
import { CalendarIcon, DollarCircleIcon, PlayIcon } from "./icons";

const CARD_CLASSES =
  "absolute flex items-center gap-[clamp(0.5rem,0.8vw,0.875rem)] rounded-[clamp(0.875rem,1.2vw,1.25rem)] bg-white/90 px-[clamp(0.875rem,1.3vw,1.5rem)] py-[clamp(0.625rem,1vw,1.125rem)] shadow-lg shadow-slate-900/5 ring-1 ring-black/5 backdrop-blur";
const CARD_ICON_CLASSES =
  "flex shrink-0 items-center justify-center h-[clamp(2rem,2.8vw,3rem)] w-[clamp(2rem,2.8vw,3rem)] rounded-[clamp(0.75rem,1vw,1rem)]";
const CARD_ICON_SVG_CLASSES = "h-[clamp(1rem,1.4vw,1.375rem)] w-[clamp(1rem,1.4vw,1.375rem)]";
const CARD_TEXT_CLASSES =
  "whitespace-nowrap text-[clamp(0.75rem,0.95vw,0.95rem)] font-medium text-body leading-snug";

function FloatingCards() {
  return (
    <>
      <div className={`${CARD_CLASSES} left-[51%] top-[49%]`}>
        <span className={`${CARD_ICON_CLASSES} bg-primary/10 text-primary`}>
          <CalendarIcon className={CARD_ICON_SVG_CLASSES} />
        </span>
        <span className={CARD_TEXT_CLASSES}>
          Auto Buy
          <br />
          <span className="text-heading">$20 monthly</span>
        </span>
      </div>

      <div className={`${CARD_CLASSES} left-[80%] top-[41%]`}>
        <span className="relative shrink-0 overflow-hidden rounded-full h-[clamp(2rem,2.8vw,3rem)] w-[clamp(2rem,2.8vw,3rem)]">
          <Image src={nvdaxLogo} alt="" fill className="object-cover" sizes="48px" />
        </span>
        <span className={CARD_TEXT_CLASSES}>
          Build Position
          <br />
          <span className="font-semibold text-heading">NVDAx ↗</span>
        </span>
      </div>

      <div className={`${CARD_CLASSES} left-[79%] top-[56%]`}>
        <span className={`${CARD_ICON_CLASSES} bg-primary text-white`}>
          <DollarCircleIcon className={CARD_ICON_SVG_CLASSES} />
        </span>
        <span className={CARD_TEXT_CLASSES}>
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
    <section className="relative overflow-hidden bg-[#D8DCE5] lg:flex lg:min-h-140 lg:items-center xl:min-h-155 2xl:min-h-175">
    
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <Image
          src={heroBg}
          alt="StackNBorrow app showing an automated NVDAx stock position, next to a recurring-buy calendar and borrowable USDC coins"
          fill
          className="object-cover"
          style={{
            maskImage: HERO_BG_FADE_MASK,
            WebkitMaskImage: HERO_BG_FADE_MASK,
          }}
          sizes="100vw"
          priority
        />
        <FloatingCards />
      </div>

      <div className="relative mx-auto w-full max-w-360 px-6 sm:px-10 lg:px-29">

        <div className="relative z-10 grid grid-cols-1 items-center gap-12 py-8 lg:grid-cols-2 lg:gap-8 lg:py-22">
          <div>
            <p className="lg:text-sm text-xs font-medium tracking-[0.2em] text-faint uppercase">
              Invest &bull; Automate &bull; Borrow
            </p>
            <h1 className="mt-6 text-3xl font-bold leading-[1.15] text-heading sm:text-5xl">
              Stack stocks.
              <br />
              Borrow against them.
              <br />
              Never sell.
            </h1>
            <p className="mt-7 max-w-lg text-sm lg:text-lg leading-relaxed text-body">
              Automate recurring stock buys on Solana, then borrow against
              your position instead of selling when you need cash all
              powered by Jupiter&apos;s existing infrastructure.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <button className="rounded-2xl bg-primary px-6 py-3 text-xs lg:px-8 lg:py-4 lg:text-base font-semibold text-white shadow-lg shadow-primary/30 transition-colors hover:bg-primary-dark">
                Get Started
              </button>
              <button className="flex items-center gap-2.5 rounded-2xl bg-subtle px-3 py-3 text-xs lg:px-7 lg:py-4 lg:text-base font-semibold text-body transition-colors hover:bg-border border">
                <PlayIcon className="h-4 w-4" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
