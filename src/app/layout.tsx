import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/shared/ui/session-provider";
import "./globals.css";
import {ReactNode} from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CoinPulse — Crypto Dashboard",
  description: "Real-time crypto prices, watchlist and portfolio tracker",
};

const RootLayout = ({children,}: Readonly<{ children: ReactNode }>) =>  {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-bg text-text-primary antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default RootLayout;