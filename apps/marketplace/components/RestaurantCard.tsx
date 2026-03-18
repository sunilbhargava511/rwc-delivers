import Link from "next/link";
import type { RestaurantWithStatus } from "@rwc/shared";
import { Badge } from "@rwc/ui";

interface RestaurantCardProps {
  restaurant: RestaurantWithStatus;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const initials = restaurant.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/restaurants/${restaurant.slug}`} className="group block">
      <div className="rounded-xl border border-gray-200 overflow-hidden transition-shadow group-hover:shadow-md">
        {/* Banner placeholder */}
        <div className="h-40 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center relative">
          <span className="text-4xl font-bold text-white/80">{initials}</span>
          {/* Open/Closed badge */}
          <div className="absolute top-3 right-3">
            <Badge variant={restaurant.is_open ? "success" : "default"}>
              {restaurant.is_open ? "Open" : "Closed"}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
            {restaurant.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {restaurant.cuisine_tags.map((tag) => (
              <Badge key={tag} variant="brand">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {restaurant.rating}
            </span>
            <span>{restaurant.review_count} reviews</span>
            <span>{restaurant.price_range}</span>
            <span>~{restaurant.default_prep_time_min} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
