import Link from "next/link";
import Image from "next/image";
import type { RestaurantWithStatus } from "@rwc/shared";
import { getRestaurantImage } from "../lib/restaurant-images";

interface RestaurantCardProps {
  restaurant: RestaurantWithStatus;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const { hero, gradient } = getRestaurantImage(restaurant.slug);

  return (
    <Link href={`/restaurants/${restaurant.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 group-hover:shadow-lg group-hover:ring-gray-300/60 group-hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={hero}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            {restaurant.is_open ? (
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-green-700 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Open
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white/80 px-2.5 py-1 rounded-full text-xs font-medium">
                Closed
              </span>
            )}
          </div>

          {/* Prep time */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {restaurant.default_prep_time_min} min
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-[15px] leading-tight group-hover:text-brand-600 transition-colors">
              {restaurant.name}
            </h3>
            <span className="shrink-0 flex items-center gap-1 text-sm font-semibold text-gray-900">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex flex-wrap gap-1">
              {restaurant.cuisine_tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-auto shrink-0">
              {restaurant.price_range}
            </span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {restaurant.review_count.toLocaleString()} reviews
          </p>
        </div>
      </div>
    </Link>
  );
}
