"use client";

const apps = [
  {
    name: "Marketplace",
    desc: "The customer-facing app — browse restaurants, build orders, track delivery in real time.",
    url: "https://rwc-delivers-production.up.railway.app",
    color: "from-blue-500 to-blue-700",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
    details: [
      "15 real Redwood City restaurants",
      "Full menus with Yelp food photos",
      "Cart, checkout, and order tracking",
    ],
  },
  {
    name: "Dashboard",
    desc: "The restaurant owner portal — manage orders, menus, and see how much you're saving vs DoorDash.",
    url: "https://rwc-dashboard-production.up.railway.app",
    color: "from-emerald-500 to-emerald-700",
    icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2",
    details: [
      "Orders kanban board",
      "Menu editor with 86'd toggles",
      "Earnings & DoorDash comparison",
    ],
  },
  {
    name: "Dispatch",
    desc: "The delivery coordinator console — assign drivers, track routes, manage the driver co-op.",
    url: "https://rwc-dispatch-production.up.railway.app",
    color: "from-amber-500 to-amber-700",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    details: [
      "Live map with driver positions",
      "Deliveries table & driver roster",
      "Schedule calendar & analytics",
    ],
  },
];

export default function DemoPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#e8614d] to-[#f59e0b] flex items-center justify-center">
              <span className="text-white font-bold text-[7px]">R</span>
            </div>
            <span className="text-white/60 text-xs font-medium">
              RWC Delivers
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Live Demo
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Three working apps built for Redwood City's independent restaurants.
            Click any card to explore.
          </p>
        </div>

        {/* App cards */}
        <div className="grid gap-6">
          {apps.map((app) => (
            <a
              key={app.name}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-6 sm:p-8 transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Icon + name */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                  >
                    <svg
                      className="w-8 h-8 text-white"
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
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">
                      {app.name}
                    </h2>
                    <svg
                      className="w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                  <p className="text-white/50 mb-4">{app.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {app.details.map((detail) => (
                      <span
                        key={detail}
                        className="text-xs bg-white/5 text-white/40 px-3 py-1 rounded-full border border-white/5"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-white/20 text-sm">
            All apps use demo data. No live database connection yet.
          </p>
          <a
            href="/deck"
            className="inline-block mt-4 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            Back to pitch deck
          </a>
        </div>
      </div>
    </div>
  );
}
