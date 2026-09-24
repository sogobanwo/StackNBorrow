import type { Metadata } from "next";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import PortfolioPageClient from "@/app/components/dashboard/portfolio/PortfolioPageClient";

export const metadata: Metadata = {
  title: "Portfolio — StackNBorrow",
  description: "Track your holdings, active orders, and performance over time.",
};

export default function PortfolioPage() {
  return (
    <>
      <DashboardTopBar title="Portfolio" subtitle="Track your holdings, active orders, and performance over time." />
      <PortfolioPageClient />
    </>
  );
}
