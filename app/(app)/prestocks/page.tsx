import type { Metadata } from "next";
import PreStocksPageClient from "@/app/components/dashboard/prestocks/PreStocksPageClient";

export const metadata: Metadata = {
  title: "Pre-IPO — StackNBorrow",
  description: "Create and manage recurring PreStocks pre-IPO purchase plans.",
};

export default function PreStocksPage() {
  return <PreStocksPageClient />;
}
