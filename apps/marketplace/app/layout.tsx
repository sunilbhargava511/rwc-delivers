import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { DemoModeBanner } from "../components/DemoModeBanner";

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
        <DemoModeBanner />
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-950 text-gray-400 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xs">R</span>
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">
                    RWC Delivers
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-3 max-w-sm leading-relaxed">
                  A City of Redwood City program supporting independent restaurants.
                  No hidden fees. No surge pricing. 100% of food revenue goes to restaurants.
                </p>
              </div>
              <div className="flex gap-8 text-sm">
                <Link href="/about" className="hover:text-white transition-colors">
                  How it Works
                </Link>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-gray-600">
              &copy; {new Date().getFullYear()} RWC Delivers &middot; City of Redwood City
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
