"use client";

import Image from "next/image";
import streakIllustration from "@/public/illustrations/streak-illustration.png";
import { FireIcon } from "@/app/components/icons";

export default function StreakCard({ totalRoundsFilled }: { totalRoundsFilled: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <Image src={streakIllustration} alt="" fill className="object-cover" sizes="280px" />
      <div className="relative bg-streak-from p-5">
        <div className="flex items-start justify-between">
          <p className="text-sm font-semibold text-amber-900/70">Your Streak</p>
          <RibbonIconBadge />
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-2xl font-bold text-amber-900">
          <FireIcon className="h-5 w-5 text-orange-500" />
          {totalRoundsFilled} {totalRoundsFilled === 1 ? "buy" : "buys"}
        </p>
        <p className="mt-1 text-xs text-amber-900/60">
          {totalRoundsFilled > 0 ? "Keep going! You're on a roll." : "Create a plan to start your streak."}
        </p>
      </div>
    </div>
  );
}

function RibbonIconBadge() {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
        <circle cx="12" cy="8" r="5" />
        <path d="M9 12.5 7 21l5-2.5L17 21l-2-8.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
