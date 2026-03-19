import { RestaurantFilters } from "../components/RestaurantFilters";
import { CartDrawer } from "../components/CartDrawer";
import { getRestaurants } from "@rwc/db";
import { formatCurrency, DELIVERY_FEE } from "@rwc/shared";

export default async function HomePage() {
  const restaurants = await getRestaurants();
  const openCount = restaurants.filter((r) => r.is_open).length;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/40 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-300">
                {openCount} restaurants open now
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              Redwood City&apos;s{" "}
              <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
                best independents
              </span>
              , delivered.
            </h1>
            <p className="mt-5 text-lg text-gray-400 max-w-lg leading-relaxed">
              Zero markup on food prices. {formatCurrency(DELIVERY_FEE)} flat delivery fee.
              100% of food revenue goes directly to restaurants.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No hidden fees
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No surge pricing
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                City-powered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <RestaurantFilters restaurants={restaurants} />
      </section>

      <CartDrawer />
    </>
  );
}
