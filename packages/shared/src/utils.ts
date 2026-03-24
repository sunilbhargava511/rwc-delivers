import type { RestaurantHours } from "./types";
import { ORDER_NUMBER_PREFIX } from "./constants";

export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatCurrencyShort(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

export function formatOrderNumber(date: Date, sequence: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const seq = String(sequence).padStart(4, "0");
  return `${ORDER_NUMBER_PREFIX}-${y}${m}${d}-${seq}`;
}

export function isRestaurantOpen(
  hours: RestaurantHours[],
  now: Date = new Date()
): boolean {
  // Convert to Pacific time since restaurant hours are stored in Pacific
  const pacificNow = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const dayOfWeek = pacificNow.getDay(); // 0=Sunday
  const currentTime = `${String(pacificNow.getHours()).padStart(2, "0")}:${String(pacificNow.getMinutes()).padStart(2, "0")}`;

  const todayHours = hours.filter((h) => h.day_of_week === dayOfWeek);
  if (todayHours.length === 0) return false;

  return todayHours.some((h) => {
    if (h.closes_next_day) {
      return currentTime >= h.open_time;
    }
    return currentTime >= h.open_time && currentTime < h.close_time;
  });
}

export function getDayName(dayOfWeek: number): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayOfWeek];
}

export function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateId(): string {
  return crypto.randomUUID();
}
