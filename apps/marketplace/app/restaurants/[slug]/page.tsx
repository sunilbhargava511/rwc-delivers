import { notFound } from "next/navigation";
import { getMockRestaurants, getMockMenu } from "../../../lib/mock-data";
import { MenuSection } from "../../../components/MenuSection";
import { CartDrawer } from "../../../components/CartDrawer";
import { Badge } from "@rwc/ui";
import { formatTime, getDayName } from "@rwc/shared";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;

  // In production: const restaurant = await getRestaurantBySlug(slug);
  const restaurant = getMockRestaurants().find((r) => r.slug === slug);
  if (!restaurant) notFound();

  // In production: const menu = await getRestaurantMenu(restaurant.id);
  const menu = getMockMenu(slug);

  const initials = restaurant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <>
      {/* Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
        <span className="text-6xl font-bold text-white/60">{initials}</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Restaurant info card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {restaurant.cuisine_tags.map((tag) => (
                  <Badge key={tag} variant="brand">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant={restaurant.is_open ? "success" : "default"}>
              {restaurant.is_open ? "Open Now" : "Closed"}
            </Badge>
          </div>

          <p className="mt-4 text-gray-600">{restaurant.description}</p>

          <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating} ({restaurant.review_count} reviews)
            </span>
            <span>{restaurant.price_range}</span>
            <span>{restaurant.address}</span>
          </div>

          {/* Hours */}
          <details className="mt-4">
            <summary className="text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-700">
              View Hours
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-1 text-sm text-gray-600">
              {restaurant.hours.map((h) => (
                <div key={h.day_of_week} className="flex justify-between">
                  <span className="font-medium">{getDayName(h.day_of_week)}</span>
                  <span>
                    {formatTime(h.open_time)} - {formatTime(h.close_time)}
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Menu */}
        <div className="mt-8 pb-32">
          {/* Sticky category nav */}
          <nav className="sticky top-16 z-10 bg-white border-b border-gray-200 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 py-3">
              {menu.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="shrink-0 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors"
                >
                  {cat.name}
                </a>
              ))}
            </div>
          </nav>

          {menu.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              restaurant={restaurant}
            />
          ))}
        </div>
      </div>

      <CartDrawer />
    </>
  );
}
