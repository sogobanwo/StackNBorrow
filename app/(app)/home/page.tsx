import type { Metadata } from "next";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import HomePageClient from "@/app/components/dashboard/home/HomePageClient";

export const metadata: Metadata = {
  title: "Home — StackNBorrow",
  description: "Your stack at a glance — balances, active plans, and quick actions.",
};

export default function HomePage() {
  return (
    <>
      <DashboardTopBar title="Home" subtitle="Your stack is growing. Keep it up!" />
      <HomePageClient />
    </>
  );
}
