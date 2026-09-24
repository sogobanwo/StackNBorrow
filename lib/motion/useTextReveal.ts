"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/motion/gsap";

export interface TextRevealOptions {
  /** "scroll" reveals as the text enters view (the default); "load" reveals immediately on mount. */
  trigger?: "scroll" | "load";
  delay?: number;
}

/** Shared text-reveal language: a per-line mask reveal, editorial rather than a typewriter/glitch effect. */
export function useTextReveal<T extends HTMLElement>(options: TextRevealOptions = {}) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (!ref.current) return;

      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        SplitText.create(ref.current!, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              opacity: 0,
              duration: 0.8,
              stagger: 0.08,
              delay: options.delay ?? 0,
              ease: "power3.out",
              scrollTrigger:
                options.trigger === "load"
                  ? undefined
                  : { trigger: ref.current, start: "top 85%", toggleActions: "play none none none" },
            }),
        });
      });
    },
    { scope: ref }
  );

  return ref;
}
