"use client";

import Image from "next/image";
import dashboardIllustration from "@/public/illustrations/dashboard-illustration.png";
import DashboardApp from "./dashboard/DashboardApp";
import { useTextReveal } from "@/lib/motion/useTextReveal";
import { useScrollReveal } from "@/lib/motion/useScrollReveal";

export default function DashboardShowcase() {
  const headingRef = useTextReveal<HTMLHeadingElement>();
  const mockupRef = useScrollReveal<HTMLDivElement>({ y: 16, start: "top 80%" });

  return (
    <section className="relative bg-[#F6F7FB]">
      <div className="mx-auto max-w-360 px-6 sm:px-10 lg:px-29">
        <div className="relative overflow-hidden rounded-4xl bg-[#e4e7f2]">
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
              <h2 ref={headingRef} className="mt-4 text-[42px] font-bold leading-[1.1] text-heading xl:text-[48px]">
                Build.Track.Borrow.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-body">
                Simple, powerful tools to help you grow your position and
                access liquidity - on your terms.
              </p>
            </div>
          </div>

          {/* App mockup */}
          <div
            ref={mockupRef}
            className="relative z-10 mx-4 mb-4 mt-6 overflow-hidden rounded-3xl bg-card shadow-[0_20px_60px_-15px_rgba(30,40,80,0.15)] sm:mx-6 sm:mb-6 sm:mt-8 lg:mx-8 lg:mb-8"
          >
            <DashboardApp />
          </div>
        </div>
      </div>
    </section>
  );
}
