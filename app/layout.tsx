import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackNBorrow — Stack stocks. Borrow against them. Never sell.",
  description:
    "Automate recurring stock buys on Solana, then borrow against your position instead of selling when you need cash — all powered by Jupiter's existing infrastructure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-page text-body"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
