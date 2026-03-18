import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RWC Delivers — Delivery Dispatch",
  description: "Manage deliveries and drivers for RWC Delivers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 lg:ml-64 px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
