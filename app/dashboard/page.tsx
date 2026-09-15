import type { Metadata } from "next";
import DashboardHomeContent from "@/app/components/dashboard/DashboardHomeContent";

export const metadata: Metadata = {
  title: "Dashboard — StackNBorrow",
  description: "Track your positions, active orders, and borrow against your stock holdings.",
};

export default function DashboardPage() {
  return <DashboardHomeContent />;
}
