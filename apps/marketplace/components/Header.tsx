"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CartIcon } from "./CartIcon";

export function Header() {
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("rwc_last_order");
      if (raw) {
        const { id, ts } = JSON.parse(raw);
        // Show for 24 hours
        if (Date.now() - ts < 24 * 60 * 60 * 1000) {
          setLastOrderId(id);
        }
      }
    } catch {}
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm tracking-tight">R</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-gray-900 tracking-tight">
                RWC Delivers
              </span>
              <span className="hidden sm:inline text-[11px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                Redwood City
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {lastOrderId && (
              <Link
                href={`/orders/${lastOrderId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Track Order
              </Link>
            )}
            <Link
              href="/about"
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              How it Works
            </Link>
            <CartIcon />
          </div>
        </div>
      </div>
    </header>
  );
}
