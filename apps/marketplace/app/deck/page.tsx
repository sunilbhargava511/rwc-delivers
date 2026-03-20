"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Slide data                                                         */
/* ------------------------------------------------------------------ */

const TOTAL_SLIDES = 12;

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DeckPage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goTo = useCallback(
    (index: number, dir?: "left" | "right") => {
      if (isAnimating) return;
      if (index < 0 || index >= TOTAL_SLIDES) return;
      setDirection(dir ?? (index > current ? "right" : "left"));
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [current, isAnimating]
  );

  const next = useCallback(() => goTo(current + 1, "right"), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, "left"), [current, goTo]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  /* Touch / swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  };

  /* Share */
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback ignored */
    }
  };

  const progress = ((current + 1) / TOTAL_SLIDES) * 100;

  const slides = [
    <SlideTitle key={0} />,
    <SlideProblem key={1} />,
    <SlideComparison key={2} />,
    <SlideVision key={3} />,
    <SlidePricing key={4} />,
    <SlideHowItWorks key={5} />,
    <SlideDriverCoop key={6} />,
    <SlideWhatGetsBuilt key={7} />,
    <SlideEconomics key={8} />,
    <SlideWhyNow key={9} />,
    <SlideTheAsk key={10} />,
    <SlideClosing key={11} />,
  ];

  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden select-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-[#e8614d] to-[#f59e0b] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Share button */}
      <button
        onClick={share}
        className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-sm"
      >
        {copied ? "Copied!" : "Share"}
      </button>

      {/* Slide counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <span className="text-white/40 text-xs font-mono">
          {current + 1} / {TOTAL_SLIDES}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-[#e8614d] w-6"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Click zones for navigation */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1/5 z-40 cursor-w-resize"
        onClick={prev}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-1/5 z-40 cursor-e-resize"
        onClick={next}
      />

      {/* Slide container */}
      <div className="w-full h-full relative">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-500 ease-out"
            style={{
              opacity: i === current ? 1 : 0,
              transform:
                i === current
                  ? "translateX(0) scale(1)"
                  : i < current
                    ? "translateX(-8%) scale(0.95)"
                    : "translateX(8%) scale(0.95)",
              pointerEvents: i === current ? "auto" : "none",
            }}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INDIVIDUAL SLIDES                                                  */
/* ================================================================== */

/* ---- Shared helpers ---- */

function DarkSlide({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-[#1a2332] overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-6 py-14 sm:px-16 sm:py-16">
        {children}
      </div>
    </div>
  );
}

function LightSlide({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center px-6 py-14 sm:px-16 sm:py-16">
        {children}
      </div>
    </div>
  );
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[#e8614d] text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mb-4">
      {children}
    </span>
  );
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#e8614d]">{children}</span>;
}

/* ------------------------------------------------------------------ */
/*  Slide 1 — Title                                                    */
/* ------------------------------------------------------------------ */
function SlideTitle() {
  return (
    <DarkSlide>
      <div className="text-center max-w-4xl">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#e8614d] to-[#f59e0b] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e8614d]/20">
            <span className="text-white font-black text-2xl">R</span>
          </div>
        </div>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight mb-6">
          RWC Delivers
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto mb-12">
          A City-Powered Delivery Platform
          <br />
          for Independent Restaurants
        </p>
        <div className="text-sm sm:text-base text-white/30 space-y-1">
          <p>
            Presented to the City of Redwood City
          </p>
          <p>Economic Development & Economic Mobility Offices</p>
          <p className="text-white/20 mt-4 font-mono text-xs">March 2026</p>
        </div>
      </div>
    </DarkSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 2 — The Problem                                              */
/* ------------------------------------------------------------------ */
function SlideProblem() {
  return (
    <DarkSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>The Problem</SlideLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-10">
          Delivery apps have become an{" "}
          <Accent>existential cost</Accent> for independent restaurants.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-4xl sm:text-5xl font-black text-[#e8614d] mb-2">
              20–40%
            </div>
            <p className="text-white/50 text-sm">
              of restaurant revenue now comes from delivery
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-4xl sm:text-5xl font-black text-[#e8614d] mb-2">
              25–30%
            </div>
            <p className="text-white/50 text-sm">
              platform fees — and they keep increasing
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="text-4xl sm:text-5xl font-black text-[#e8614d] mb-2">
              No Exit
            </div>
            <p className="text-white/50 text-sm">
              restaurants can&apos;t opt out without losing customers
            </p>
          </div>
        </div>

        <div className="border-l-4 border-[#e8614d]/50 pl-6">
          <p className="text-white/60 text-base sm:text-lg leading-relaxed">
            Restaurants operate on <strong className="text-white">0–8% margins</strong>. Platforms extract{" "}
            <strong className="text-white">$1,200–$4,500/month</strong> per restaurant — money that leaves
            Redwood City entirely.
          </p>
          <p className="text-white/40 text-sm mt-4 italic">
            A restaurant doing $10K/month in delivery pays DoorDash ~$2,500.
            That&apos;s rent money.
          </p>
        </div>
      </div>
    </DarkSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 3 — Interactive Comparison Calculator                        */
/* ------------------------------------------------------------------ */
function SlideComparison() {
  const [orderSize, setOrderSize] = useState(50);
  const [ordersPerDay, setOrdersPerDay] = useState(5);

  // DoorDash fees
  const ddCommission = orderSize * 0.27;
  const ddProcessing = orderSize * 0.03;
  const ddRestaurantReceives = orderSize - ddCommission - ddProcessing;
  const ddDeliveryFee = 5.99;
  const ddServiceFee = 7.0;
  const ddCustomerPays = orderSize + ddDeliveryFee + ddServiceFee;

  // RWC fees (15% launch plan)
  const rwcCommission = orderSize * 0.15;
  const rwcProcessing = orderSize * 0.03;
  const rwcRestaurantReceives = orderSize - rwcCommission - rwcProcessing;
  const rwcDeliveryFee = 4.5;
  const rwcCustomerPays = orderSize + rwcDeliveryFee;

  // Annual impact (365 days)
  const perOrderSavings = rwcRestaurantReceives - ddRestaurantReceives;
  const annualSavingsPerRestaurant = perOrderSavings * ordersPerDay * 365;
  const customerSavingsPerOrder = ddCustomerPays - rwcCustomerPays;
  const annualCustomerSavings = customerSavingsPerOrder * ordersPerDay * 365;
  const numRestaurants = 30;
  const totalEconomyImpact = annualSavingsPerRestaurant * numRestaurants;

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>Interactive Calculator</SlideLabel>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">
          DoorDash vs. RWC Delivers
        </h2>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Avg Order Size</span>
              <span className="text-2xl font-black text-gray-900">${orderSize}</span>
            </div>
            <input
              type="range"
              min={15}
              max={100}
              step={5}
              value={orderSize}
              onChange={(e) => setOrderSize(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #e8614d ${((orderSize - 15) / 85) * 100}%, #e5e7eb ${((orderSize - 15) / 85) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>$15</span><span>$100</span>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Orders / Day</span>
              <span className="text-2xl font-black text-gray-900">{ordersPerDay}</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={ordersPerDay}
              onChange={(e) => setOrdersPerDay(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #e8614d ${((ordersPerDay - 1) / 19) * 100}%, #e5e7eb ${((ordersPerDay - 1) / 19) * 100}%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1</span><span>20</span>
            </div>
          </div>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* DoorDash */}
          <div className="bg-white rounded-2xl border-2 border-red-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">DD</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">On DoorDash</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Menu price</span>
                <span className="font-semibold text-gray-900">${fmt(orderSize)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Commission (27%)</span>
                <span className="font-semibold">-${fmt(ddCommission)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Processing (3%)</span>
                <span className="font-semibold">-${fmt(ddProcessing)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Restaurant gets</span>
                <span className="font-black text-red-600 text-lg">${fmt(ddRestaurantReceives)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
              Customer pays: ${fmt(orderSize)} + ${fmt(ddDeliveryFee)} + ${fmt(ddServiceFee)} ={" "}
              <strong className="text-gray-600">${fmt(ddCustomerPays)}</strong>
            </div>
          </div>

          {/* RWC Delivers */}
          <div className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-sm ring-2 ring-emerald-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-[#e8614d] to-[#f59e0b] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">R</span>
              </div>
              <span className="font-bold text-gray-900 text-sm">On RWC Delivers</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Menu price</span>
                <span className="font-semibold text-gray-900">${fmt(orderSize)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Commission (15%)</span>
                <span className="font-semibold">-${fmt(rwcCommission)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Processing (3%)</span>
                <span className="font-semibold">-${fmt(rwcProcessing)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Restaurant gets</span>
                <span className="font-black text-emerald-600 text-lg">${fmt(rwcRestaurantReceives)}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
              Customer pays: ${fmt(orderSize)} + ${fmt(rwcDeliveryFee)} + no service fee ={" "}
              <strong className="text-gray-600">${fmt(rwcCustomerPays)}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic impact stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-700">+${fmtInt(annualSavingsPerRestaurant)}</div>
            <div className="text-xs text-emerald-600 mt-0.5">saved per restaurant/year</div>
            <div className="text-[10px] text-emerald-500">+${fmt(perOrderSavings)}/order</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <div className="text-xl sm:text-2xl font-black text-blue-700">${fmt(customerSavingsPerOrder)}</div>
            <div className="text-xs text-blue-600 mt-0.5">saved per customer order</div>
            <div className="text-[10px] text-blue-500">${fmtInt(annualCustomerSavings)}/yr per household</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <div className="text-xl sm:text-2xl font-black text-amber-700">${totalEconomyImpact >= 1000000 ? `${(totalEconomyImpact / 1000000).toFixed(1)}M` : `${fmtInt(totalEconomyImpact)}`}</div>
            <div className="text-xs text-amber-600 mt-0.5">recouped/yr by RWC economy</div>
            <div className="text-[10px] text-amber-500">{numRestaurants} restaurants</div>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 4 — The Vision                                               */
/* ------------------------------------------------------------------ */
function SlideVision() {
  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>The Vision</SlideLabel>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
          A city-backed delivery platform that keeps money local, creates youth
          jobs, and supports independent restaurants.
        </h2>
        <p className="text-gray-400 mb-12 text-lg">Three pillars.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Restaurant Savings
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Start risk-free at 15%, then subscription plans from{" "}
              <strong className="text-gray-700">$99/mo</strong>
            </p>
          </div>

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Youth Employment
            </h3>
            <p className="text-gray-500 leading-relaxed">
              <strong className="text-gray-700">15–20 local students</strong>{" "}
              employed as W-2 delivery drivers
            </p>
          </div>

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#e8614d] to-[#f59e0b] flex items-center justify-center mb-5 shadow-lg shadow-orange-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Local Economy
            </h3>
            <p className="text-gray-500 leading-relaxed">
              <strong className="text-gray-700">$720K+/year</strong> in
              commissions stays in Redwood City
            </p>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 5 — Pricing                                                  */
/* ------------------------------------------------------------------ */
function SlidePricing() {
  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>Pricing</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Two steps. Zero upfront risk.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-xs font-bold text-[#e8614d] uppercase tracking-widest mb-3">
              Step 1 — Launch Plan (First 90 Days)
            </div>
            <div className="text-4xl font-black text-gray-900 mb-4">15%</div>
            <div className="text-sm text-gray-400 mb-5">commission per order</div>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">&#10003;</span>
                No monthly fee
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">&#10003;</span>
                Customer pays delivery fee separately
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">&#10003;</span>
                Full onboarding + support
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-0.5">&#10003;</span>
                Test demand before committing
              </li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border-2 border-[#e8614d]/30 p-6 shadow-sm ring-2 ring-[#e8614d]/10">
            <div className="text-xs font-bold text-[#e8614d] uppercase tracking-widest mb-3">
              Step 2 — Your Best Plan (After 90 Days)
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { name: "Starter", fee: "$99/mo", per: "$3/order" },
                { name: "Growth", fee: "$199/mo", per: "$2/order" },
                { name: "Pro", fee: "$299/mo", per: "$1/order" },
                { name: "Power", fee: "$399/mo", per: "$0.50/order" },
              ].map((p) => (
                <div
                  key={p.name}
                  className="bg-gray-50 rounded-xl p-3 text-center"
                >
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">
                    {p.name}
                  </div>
                  <div className="font-black text-gray-900 text-sm">
                    {p.fee}
                  </div>
                  <div className="text-xs text-gray-500">+ {p.per}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>Break-even: 2–4 orders/day vs 15% plan</p>
              <p>5+ orders/day subscription saves $500–$1,500+/mo</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <span className="inline-block bg-emerald-100 text-emerald-800 font-bold text-sm px-5 py-2 rounded-full">
            $0 upfront risk
          </span>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 6 — How It Works                                             */
/* ------------------------------------------------------------------ */
function SlideHowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Customer Orders",
      desc: "Via the RWC Delivers app or the restaurant's own website",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-blue-400 to-blue-600",
    },
    {
      num: "2",
      title: "Restaurant Prepares",
      desc: "Order appears on dashboard with prep time estimate",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: "from-emerald-400 to-emerald-600",
    },
    {
      num: "3",
      title: "Student Driver Delivers",
      desc: "City-employed student picks up and delivers within downtown zone",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-amber-400 to-amber-600",
    },
    {
      num: "4",
      title: "Money Stays Local",
      desc: "Restaurant pays 15% to start, then low subscription. No VC middleman.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-[#e8614d] to-[#f59e0b]",
    },
  ];

  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>How It Works</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          Four steps. Simple.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div
                className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                {s.icon}
              </div>
              <div className="text-xs font-bold text-[#e8614d] mb-1">
                Step {s.num}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 7 — Driver Co-op                                             */
/* ------------------------------------------------------------------ */
function SlideDriverCoop() {
  return (
    <DarkSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>The City Runs the Driver Co-op</SlideLabel>
        <p className="text-white/50 text-base sm:text-lg italic mb-10 max-w-3xl">
          &ldquo;This is the centerpiece — what makes RWC Delivers a city
          program, not just an app.&rdquo;
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What the city operates */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">
              What the City Operates
            </h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex gap-3 items-start">
                <span className="text-[#e8614d] text-lg leading-none">&#9679;</span>
                Hire <strong className="text-white">15–20 drivers</strong>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#e8614d] text-lg leading-none">&#9679;</span>
                Program Coordinator <strong className="text-white">(1 FTE)</strong>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-[#e8614d] text-lg leading-none">&#9679;</span>
                <strong className="text-white">AB5 compliant</strong> from day one
              </li>
            </ul>
          </div>

          {/* Why city-run wins */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-5">
              Why City-Run Wins
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "W-2 wages", value: "$18–22/hr" },
                { label: "Local youth", value: "Sequoia High, Canada College" },
                { label: "Real jobs", value: "Not gig work" },
                { label: "Quality", value: "City controls standards" },
                { label: "Subsidy", value: "County $2M Workforce Initiative" },
                { label: "Resume says", value: "\"City of Redwood City\"" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-xl p-3"
                >
                  <div className="text-[10px] font-bold text-[#e8614d] uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  <div className="text-white text-sm font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DarkSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 8 — What Gets Built                                          */
/* ------------------------------------------------------------------ */
function SlideWhatGetsBuilt() {
  const apps = [
    {
      name: "Marketplace",
      desc: "Customer ordering",
      color: "from-blue-500 to-blue-700",
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
    },
    {
      name: "Dashboard",
      desc: "Restaurant management",
      color: "from-emerald-500 to-emerald-700",
      icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    },
    {
      name: "Dispatch",
      desc: "Delivery coordination",
      color: "from-amber-500 to-amber-700",
      icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    },
    {
      name: "Payments",
      desc: "Stripe Connect settlements",
      color: "from-violet-500 to-violet-700",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
  ];

  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>What Gets Built</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Four apps. One platform.
        </h2>
        <p className="text-gray-400 mb-12 text-lg">
          Built affordably using modern AI coding tools.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {apps.map((app) => (
            <div
              key={app.name}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div
                className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4 shadow-lg`}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={app.icon}
                  />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">
                {app.name}
              </h3>
              <p className="text-sm text-gray-500">{app.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 9 — The Economics                                            */
/* ------------------------------------------------------------------ */
function SlideEconomics() {
  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>The Economics</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10">
          Self-sustaining by month 10.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Restaurant Revenue */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">Restaurant Revenue</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                Launch <strong className="text-gray-900">15%</strong> then{" "}
                <strong className="text-gray-900">$99–$399/mo</strong>
              </p>
              <p>
                Saves{" "}
                <strong className="text-emerald-600">$15K–$25K+/yr</strong> vs
                DoorDash
              </p>
              <p>
                Steady state{" "}
                <strong className="text-gray-900">~$6K–$12K/mo</strong>
              </p>
            </div>
          </div>

          {/* Delivery fee */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3">
              Customer Delivery Fee
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">$4–5</strong> funds driver
                co-op
              </p>
              <p>
                ~100 deliveries/day x $4.50 ={" "}
                <strong className="text-gray-900">~$13,500/mo</strong>
              </p>
              <p className="text-emerald-600 font-semibold">
                Self-sustaining by month 10
              </p>
            </div>
          </div>
        </div>

        {/* ROI Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-gray-900 text-white text-xs font-bold uppercase tracking-widest px-6 py-3">
            City Investment & ROI
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                year: "Year 1",
                invest: "$50K",
                kept: "$720K+",
                roi: "14:1",
                roiColor: "text-emerald-600",
              },
              {
                year: "Year 2",
                invest: "$25K",
                kept: "$720K+",
                roi: "29:1",
                roiColor: "text-emerald-600",
              },
              {
                year: "Year 3+",
                invest: "In-kind only",
                kept: "$720K+",
                roi: "\u221E",
                roiColor: "text-[#e8614d]",
              },
            ].map((r) => (
              <div
                key={r.year}
                className="grid grid-cols-4 px-6 py-3 text-sm items-center"
              >
                <span className="font-bold text-gray-900">{r.year}</span>
                <span className="text-gray-500">{r.invest} city</span>
                <span className="text-gray-500">{r.kept} kept local</span>
                <span className={`font-black text-xl ${r.roiColor}`}>
                  {r.roi}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 10 — Why Now                                                 */
/* ------------------------------------------------------------------ */
function SlideWhyNow() {
  const reasons = [
    {
      title: "Restaurants at breaking point",
      detail: "0–8% margins with 25–30% to platforms",
    },
    {
      title: "Customers overpaying",
      detail: "$10–15 in fees per order",
    },
    {
      title: "AB5 makes gig model fragile",
      detail: "City W-2 program compliant from day one",
    },
    {
      title: "Technology cost near zero",
      detail: "AI coding tools make custom apps affordable",
    },
  ];

  return (
    <LightSlide>
      <div className="max-w-4xl w-full">
        <SlideLabel>Why Now</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
          The window is open.
        </h2>

        <div className="space-y-6 mb-12">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#e8614d] to-[#f59e0b] flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {i + 1}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{r.title}</h3>
                <p className="text-gray-500">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#1a2332] rounded-2xl p-8 text-center">
          <p className="text-white text-xl sm:text-2xl font-semibold italic">
            &ldquo;Redwood City can be the{" "}
            <span className="text-[#e8614d]">first city</span> in the Bay Area
            to do this.&rdquo;
          </p>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 11 — The Ask                                                 */
/* ------------------------------------------------------------------ */
function SlideTheAsk() {
  return (
    <LightSlide>
      <div className="max-w-5xl w-full">
        <SlideLabel>The Ask</SlideLabel>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Start small. Prove it. Scale.
        </h2>
        <p className="text-gray-400 text-lg mb-10">
          10 restaurants &middot; Lunch only &middot; 60 days &middot; Scale
          only after success
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* From the City */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              From the City
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "Run driver co-op",
                "Program Coordinator (1 FTE)",
                "$50K Year 1 investment",
                "Marketing through city channels",
                "Connection to Jobs for Youth",
              ].map((item) => (
                <li key={item} className="flex gap-2 items-start">
                  <span className="text-[#e8614d] mt-0.5 font-bold">&#8594;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* The City Gets */}
          <div className="bg-gradient-to-br from-[#1a2332] to-[#243347] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-5">
              The City Gets
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              {[
                { text: "$720K+/yr kept local", highlight: true },
                { text: "15–20 youth jobs", highlight: true },
                { text: "30 restaurants strengthened", highlight: false },
                { text: "Measurable KPIs", highlight: false },
                { text: "National model", highlight: false },
                { text: "14:1 ROI", highlight: true },
              ].map((item) => (
                <li key={item.text} className="flex gap-2 items-start">
                  <span className="text-[#e8614d] mt-0.5">&#10003;</span>
                  <span className={item.highlight ? "text-white font-semibold" : ""}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </LightSlide>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide 12 — Closing Quote                                           */
/* ------------------------------------------------------------------ */
function SlideClosing() {
  return (
    <DarkSlide>
      <div className="max-w-4xl w-full text-center">
        <div className="mb-12">
          <div className="text-6xl text-[#e8614d]/30 font-serif mb-4">&ldquo;</div>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-white font-light leading-relaxed">
            For the cost of repaving half a block, we can build a platform that
            puts{" "}
            <strong className="font-bold text-[#e8614d]">
              two million dollars
            </strong>{" "}
            back into our local restaurants over three years.
          </p>
          <div className="text-6xl text-[#e8614d]/30 font-serif mt-4">&rdquo;</div>
        </div>

        <div className="mb-12">
          <p className="text-xl sm:text-2xl text-white/70 font-medium">
            Let&apos;s bring this to Redwood City.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-8 py-4">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e8614d] to-[#f59e0b] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <div className="text-left">
            <div className="text-white font-bold text-sm">RWC Delivers</div>
            <div className="text-white/40 text-xs">
              sunilbhargava@gmail.com
            </div>
          </div>
        </div>
      </div>
    </DarkSlide>
  );
}
