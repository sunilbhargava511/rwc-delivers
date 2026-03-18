import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RWC Delivers — Redwood City's Independent Restaurant Delivery",
  description:
    "Order delivery from Redwood City's best independent restaurants. No hidden fees, no surge pricing. Support local.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d62d8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-semibold text-brand-700">
                  RWC Delivers
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  A City of Redwood City program supporting independent
                  restaurants
                </p>
              </div>
              <div className="flex gap-6 text-sm text-gray-500">
                <a href="/about" className="hover:text-gray-700">
                  About
                </a>
                <a href="/faq" className="hover:text-gray-700">
                  FAQ
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
