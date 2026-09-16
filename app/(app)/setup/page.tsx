import type { Metadata } from "next";
import SetupPageClient from "@/app/components/dashboard/setup/SetupPageClient";

export const metadata: Metadata = {
  title: "Setup — StackNBorrow",
  description: "Create and manage your recurring stock purchase plans.",
};

export default function SetupPage() {
  return <SetupPageClient />;
}
