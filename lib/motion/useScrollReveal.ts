"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";

export interface ScrollRevealOptions {
  /** CSS selector for children of the scope element to reveal. Omit to reveal the scope element itself. */
  selector?: string;
  y?: number;
  stagger?: number;
  start?: string;
}

/** The shared landing-page reveal language: fade + rise + slight blur-in, once, as the element scrolls into view. */
export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      if (!scope.current) return;
      const targets = options.selector ? gsap.utils.toArray<HTMLElement>(options.selector, scope.current) : scope.current;
      if (Array.isArray(targets) && targets.length === 0) return;

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          targets,
          { opacity: 0, y: options.y ?? 24, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: options.stagger ?? 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scope.current,
              start: options.start ?? "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope }
  );

  return scope;
}
