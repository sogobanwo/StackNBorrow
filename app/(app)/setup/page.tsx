import type { Metadata } from "next";
import DashboardTopBar from "@/app/components/dashboard/DashboardTopBar";
import SetupPageClient from "@/app/components/dashboard/setup/SetupPageClient";

export const metadata: Metadata = {
  title: "Setup — StackNBorrow",
  description: "Create and manage your recurring stock purchase plans.",
};

export default function SetupPage() {
  return (
    <>
      <DashboardTopBar
        title="Setup"
        subtitle="Create and manage your recurring buy plans."
      />
      <SetupPageClient />
    </>
  );
}
