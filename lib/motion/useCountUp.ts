"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion/gsap";

/** Tweens a displayed numeric value toward `target` whenever it changes — used by dashboard stat tiles as data loads. */
export function useCountUp(target: number | null, formatter: (value: number) => string): string {
  const [display, setDisplay] = useState(target ?? 0);
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const proxy = useRef({ value: target ?? 0 });

  useEffect(() => {
    if (target === null || reducedMotion) return;

    const tween = gsap.to(proxy.current, {
      value: target,
      duration: 0.6,
      ease: "power3.out",
      onUpdate: () => setDisplay(proxy.current.value),
    });
    return () => {
      tween.kill();
    };
  }, [target, reducedMotion]);

  if (target === null) return "—";
  return formatter(reducedMotion ? target : display);
}
