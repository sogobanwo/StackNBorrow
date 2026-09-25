import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StackNBorrow: Stack stocks. Borrow against them. Never sell.",
  description:
    "Automate recurring stock buys on Solana, then borrow against your position instead of selling when you need cash all powered by Jupiter's existing infrastructure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-page text-body"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
        <Script
          id="guideai-widget"
          src="https://cdn.3guideai.com/sdk/guideai.js"
          strategy="afterInteractive"
          data-guideai-bundle="guidance"
          data-site-id="34083125-c34f-40d2-a1c6-0337e5f8f83f"
          data-token="pk_live_DX7CjNYGeQhIZyNshQC6i5DJayWTwKmAkK0_Ky2wZyc"
          data-api-url="https://cdn.3guideai.com"
          data-cdn-url="https://cdn.3guideai.com"
          data-disable-routes=""
          data-track-all="true"
          data-behavioral-triggers="true"
          data-bubble-enabled="true"
          data-widget-mode="combined"
          data-bubble-label="Ask me anything about stacksNborrow "
          data-bubble-icon="robot"
          data-bubble-position="bottom-right"
          data-chat-expand-dock="right"
          data-bubble-mode="drift"
          data-bubble-drift-enabled="false"
          data-bubble-drift-spring="0.0003"
          data-bubble-drift-damping="0.993"
          data-bubble-drift-min-interval="18000"
          data-bubble-drift-max-interval="26000"
          data-bubble-crawl-speed="40"
          data-bubble-crawl-climb-walls="true"
          data-bubble-crawl-corner-pause-ms="1500"
          data-bubble-crawl-persistent-speech="true"
          data-bubble-crawl-messages="Need help? Click me!|I can guide you around.|Try asking me anything!"
          data-bubble-crawl-message-interval-ms="8000"
          data-chat-guidance-title="I’ll walk you through it"
          data-chat-guidance-text="Ask how to do something and I’ll show you, step by step, right here on the page."
          data-chat-assistant-title="I’ll do it for you"
          data-chat-assistant-text="Tell me what you need done and I’ll take the actions myself — checking with you first."
          data-chat-suggestions="How do I get started?|Show me around"
          data-guides-enabled="true"
          data-auto-advance-on-target-click="true"
          data-chip-dismiss-seconds="300"
          data-help-hints="false"
          data-help-hints-cache-ttl-ms="86400000"
          data-announcement-surface="modal"
          data-announcement-display-mode="auto"
          data-announcement-frequency="once"
          data-announcement-close-on-backdrop="true"
          data-announcement-auto-show-delay-ms="500"
          data-feedback-auto-prompt="false"
          data-feedback-prompt-delay-ms="300000"
          data-feedback-prompt-min-pageviews="10"
          data-idle-timeout="20000"
          data-session-timeout-ms="1800000"
          data-batch-size="50"
          data-batch-interval-ms="30000"
          data-geolocation="off"
          data-recording="false"
          data-extension-mode="false"
          data-theme-primary="#1E67F0"
          data-theme-background="#FFFFFF"
          data-theme-text="#182134"
          data-theme-font="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          data-bubble-background="#E8EFFE"
          data-bubble-background-hover="#E8EFFE"
          data-bubble-text-color="#154FC0"
          data-bubble-border="#1E67F04D"
          data-bubble-border-hover="#1E67F080"
          data-bubble-shadow="0 8px 24px rgba(15, 23, 42, 0.16)"
          data-bubble-shadow-hover="0 12px 32px rgba(15, 23, 42, 0.22)"
          data-bubble-focus-ring="0 0 0 3px #1E67F055"
        />
        <Script
          id="guideai-tracking"
          src="https://cdn.3guideai.com/sdk/guideai-tracking.js"
          strategy="afterInteractive"
          data-guideai-bundle="tracking"
          data-site-id="34083125-c34f-40d2-a1c6-0337e5f8f83f"
          data-token="pk_live_DX7CjNYGeQhIZyNshQC6i5DJayWTwKmAkK0_Ky2wZyc"
          data-api-url="https://cdn.3guideai.com"
          data-cdn-url="https://cdn.3guideai.com"
          data-disable-routes=""
          data-batch-size="50"
          data-batch-interval-ms="30000"
          data-recording="false"
          data-extension-mode="false"
        />
      </body>
    </html>
  );
}
