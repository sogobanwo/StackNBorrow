"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

/** Staggers in a row container's children the first time `rowCount` goes above 0 — never replays on later refreshes. */
export function useRowReveal<T extends HTMLElement>(rowCount: number) {
  const ref = useRef<T>(null);
  const hasRevealed = useRef(false);

  useEffect(() => {
    if (hasRevealed.current || rowCount === 0 || !ref.current) return;
    hasRevealed.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(ref.current.children, {
      opacity: 0,
      y: 10,
      duration: 0.35,
      stagger: 0.05,
      ease: "power2.out",
    });
  }, [rowCount]);

  return ref;
}
