"use client";

import Link from "next/link";
import { CartIcon } from "./CartIcon";

export function Header() {
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
