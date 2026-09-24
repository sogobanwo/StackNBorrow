import type { Metadata } from "next";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import BuyPageClient from "@/app/components/dashboard/buy/BuyPageClient";

export const metadata: Metadata = {
  title: "Buy — StackNBorrow",
  description: "Make a one-time stock purchase, settled immediately via Jupiter Swap.",
};

export default function BuyPage() {
  return (
    <>
      <DashboardTopBar title="Buy" subtitle="A one-time purchase — no recurring schedule." />
      <BuyPageClient />
    </>
  );
}
