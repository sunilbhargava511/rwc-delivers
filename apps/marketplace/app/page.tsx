import { RestaurantCard } from "../components/RestaurantCard";
import { RestaurantFilters } from "../components/RestaurantFilters";
import { CartDrawer } from "../components/CartDrawer";
import { getMockRestaurants } from "../lib/mock-data";

export default async function HomePage() {
  // In production, use: const restaurants = await getRestaurants();
  const restaurants = getMockRestaurants();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <h1 className="text-3xl md:text-5xl font-bold max-w-2xl">
            Order from Redwood City&apos;s best independents
          </h1>
          <p className="mt-4 text-lg text-brand-100 max-w-xl">
            No hidden fees. No surge pricing. $4.50 flat delivery.
            <br />
            100% of food revenue goes to restaurants.
          </p>
          <div className="mt-6 flex gap-3">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              {restaurants.filter((r) => r.is_open).length} restaurants open now
            </span>
          </div>
        </div>
      </section>

      {/* Restaurant Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RestaurantFilters restaurants={restaurants} />
      </section>

      <CartDrawer />
    </>
  );
}
