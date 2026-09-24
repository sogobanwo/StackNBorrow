"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";

/** A quick, consistent fade+rise on every dashboard route change — confirmatory, not decorative. */
export default function DashboardPageTransition({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, { opacity: 0, y: 8, duration: 0.3, ease: "power2.out" });
      });
    },
    { scope: ref, dependencies: [pathname] }
  );

  return <div ref={ref}>{children}</div>;
}
