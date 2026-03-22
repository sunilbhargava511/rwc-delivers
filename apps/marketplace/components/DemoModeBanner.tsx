"use client";

import { useState } from "react";
import { useDemoMode } from "../hooks/useDemoMode";

export function DemoModeBanner() {
  const { demoMode, toggleDemoMode } = useDemoMode();
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      {/* Floating gear button */}
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="Settings"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Demo mode indicator in top bar */}
      {demoMode && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-xs">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="font-medium text-amber-800">Demo Mode</span>
            <span className="text-amber-600">— Using simulated data</span>
            <button
              onClick={() => setShowPanel(true)}
              className="ml-2 text-amber-700 hover:text-amber-900 underline"
            >
              Settings
            </button>
          </div>
        </div>
      )}

      {/* Settings panel overlay */}
      {showPanel && (
        <div className="fixed inset-0 z-[60]" onClick={() => setShowPanel(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                <button
                  onClick={() => setShowPanel(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Demo Mode Toggle */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">Demo Mode</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Simulate orders, restaurants, and deliveries with fake data
                    </p>
                  </div>
                  <button
                    onClick={toggleDemoMode}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      demoMode ? "bg-brand-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                        demoMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className={`text-xs rounded-lg p-3 ${demoMode ? "bg-amber-50 text-amber-700" : "bg-gray-50 text-gray-500"}`}>
                  {demoMode ? (
                    <>
                      <strong>ON:</strong> All 3 apps (Marketplace, Dashboard, Dispatch) use simulated restaurants, orders, drivers, and deliveries.
                    </>
                  ) : (
                    <>
                      <strong>OFF:</strong> Apps will attempt to connect to the live database. If no database is configured, pages may show empty states.
                    </>
                  )}
                </div>
              </div>

              {/* Links to other apps */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Other Apps</h3>
                <div className="space-y-2">
                  {[
                    { name: "Dashboard", desc: "Restaurant portal", url: "https://rwc-dashboard-production.up.railway.app" },
                    { name: "Dispatch", desc: "Delivery coordinator", url: "https://rwc-dispatch-production.up.railway.app" },
                  ].map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div>
                        <span className="text-sm font-medium text-gray-900">{app.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{app.desc}</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
