import { Inter } from "next/font/google";
import { Providers } from "@/redux/provider";
import { Toaster } from "@/components/ui/toaster";
import { WebSocketProvider } from "@/components/websocket-provider";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CryptoWeather Nexus",
  description: "A dashboard combining weather data, cryptocurrency information, and real-time notifications",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>
            <WebSocketProvider>
              {children}
              <Toaster />
            </WebSocketProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
