"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

/**
 * Drives Lenis off GSAP's own ticker (instead of Lenis's built-in rAF loop) so ScrollTrigger stays
 * in sync with the smoothed scroll position — the standard GSAP+Lenis integration recipe.
 * Lenis's own `respectReducedMotion` (on by default) already disables smoothing for
 * prefers-reduced-motion users, so no extra branching is needed here.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
