import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SessionProvider } from "@/app/_providers/session-provider";
import { QueryProvider } from "@/app/_providers/query-provider";
import { GlobalTranslatorBridge } from "@/shared/lib/global-translator-bridge";
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

const RootLayout = async ({children,}: Readonly<{ children: ReactNode }>) =>  {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-bg text-text-primary antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalTranslatorBridge />
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            <SessionProvider>
              <QueryProvider>
                {children}
                <Toaster richColors closeButton position="bottom-right" />
              </QueryProvider>
            </SessionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;