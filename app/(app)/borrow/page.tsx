import type { Metadata } from "next";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import BorrowPageClient from "@/app/components/dashboard/borrow/BorrowPageClient";

export const metadata: Metadata = {
  title: "Borrow — StackNBorrow",
  description:
    "Use your stock holdings as collateral and borrow USDC without selling.",
};

export default function BorrowPage() {
  return (
    <>
      <DashboardTopBar
        title="Borrow"
        subtitle="Use your stock holdings as collateral and borrow USDC — without selling."
      />
      <BorrowPageClient />
    </>
  );
}
