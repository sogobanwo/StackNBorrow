"use client";

import Image from "next/image";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";
import automateIcon from "@/public/illustrations/feature-icon-automate.png";
import trackIcon from "@/public/illustrations/feature-icon-track.png";
import borrowIcon from "@/public/illustrations/feature-icon-borrow.png";
import jupiterIcon from "@/public/illustrations/feature-icon-jupiter.png";

const FEATURES = [
  {
    icon: automateIcon,
    title: "Automate Your Buys",
    body: "Set up recurring purchases of tokenized stocks with Jupiter's Recurring API.",
  },
  {
    icon: trackIcon,
    title: "Track Your Position",
    body: "See your accumulated holdings, order history and total value in real time.",
  },
  {
    icon: borrowIcon,
    title: "Borrow When You Need",
    body: "Use your stock holdings as collateral and borrow USDC via Jupiter's Lend API no selling required.",
  },
  {
    icon: jupiterIcon,
    title: "Built on Jupiter",
    body: "Powered by Jupiter's Swap, Recurring and Lend APIs. No custom smart contracts.",
  },
];

export default function FeatureGrid() {
  const gridRef = useScrollReveal<HTMLDivElement>({ selector: ".feature-item", stagger: 0.1 });

  return (
    <section id="features" className="relative bg-[#F6F7FB]">
      <div
        ref={gridRef}
        className="mx-auto grid max-w-360 grid-cols-1 gap-x-8 gap-y-8 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-29 lg:py-16"
      >
        {FEATURES.map((feature) => (
          <div key={feature.title} className="feature-item">
            <Image
              src={feature.icon}
              alt=""
              width={69}
              height={69}
              className="h-17.25 w-17.25"
            />
            <h3 className="mt-6 text-lg font-semibold text-heading">
              {feature.title}
            </h3>
            <p className="mt-3 max-w-65 text-sm leading-relaxed text-body">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
