import Image from "next/image";
import { notFound } from "next/navigation";
import { getRestaurantBySlug, getRestaurantMenu } from "@rwc/db";
import { MenuSection } from "../../../components/MenuSection";
import { CartDrawer } from "../../../components/CartDrawer";
import { formatTime, getDayName } from "@rwc/shared";
import { getRestaurantImage } from "../../../lib/restaurant-images";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;

  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const menu = await getRestaurantMenu(restaurant.id);
  const { hero, gradient } = getRestaurantImage(slug);

  return (
    <>
      {/* Hero Banner */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        <Image
          src={hero}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                {restaurant.name}
              </h1>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {restaurant.cuisine_tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium text-white/90 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {restaurant.is_open ? (
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white/80 px-3 py-1.5 rounded-full text-sm font-medium">
                Closed
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Restaurant info card */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/60 p-6 -mt-6 relative z-10">
          <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 font-medium text-gray-900">
              <svg
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
              <span className="text-gray-400 font-normal">
                ({restaurant.review_count.toLocaleString()} reviews)
              </span>
            </span>
            <span className="text-gray-300">|</span>
            <span>{restaurant.price_range}</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
              </svg>
              {restaurant.address}
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {restaurant.default_prep_time_min} min prep
            </span>
          </div>

          {/* Hours */}
          <details className="mt-4">
            <summary className="text-sm font-medium text-brand-600 cursor-pointer hover:text-brand-700">
              View Hours
            </summary>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm text-gray-600">
              {restaurant.hours.map((h) => (
                <div key={h.day_of_week} className="flex justify-between bg-gray-50 rounded-lg px-3 py-1.5">
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
          <nav className="sticky top-16 z-10 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 py-3">
              {menu.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="shrink-0 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors"
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
