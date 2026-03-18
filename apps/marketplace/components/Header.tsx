"use client";

import Link from "next/link";
import { CartIcon } from "./CartIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">
                RWC Delivers
              </span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-2">
                Redwood City
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="hidden sm:inline text-sm text-gray-600 hover:text-gray-900"
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
