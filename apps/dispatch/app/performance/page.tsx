"use client";

import { getMockPerformanceStats } from "../../lib/mock-data";
import { formatCurrency } from "@rwc/shared";
import { Badge } from "@rwc/ui";

const stats = getMockPerformanceStats();

export default function PerformancePage() {
  const maxVolume = Math.max(
    ...stats.dailyVolume.map((d) => d.cityDriver + d.courier)
  );
  const maxTime = Math.max(...stats.avgDeliveryTime.map((d) => d.minutes));
  const maxCost = Math.max(...stats.costPerDelivery.map((d) => d.cost));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Performance Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor delivery performance, volume trends, and driver rankings.
          </p>
        </div>

        {/* 1. Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <PerfStatsCard label="Today" data={stats.today} />
          <PerfStatsCard label="This Week" data={stats.thisWeek} />
          <PerfStatsCard label="This Month" data={stats.thisMonth} />
        </div>

        {/* 2. Delivery Volume — Last 14 Days */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Delivery Volume — Last 14 Days
          </h2>
          <div className="flex items-end gap-1.5 h-48">
            {stats.dailyVolume.map((day, i) => {
              const totalPct =
                maxVolume > 0
                  ? ((day.cityDriver + day.courier) / maxVolume) * 100
                  : 0;
              const cityPct =
                day.cityDriver + day.courier > 0
                  ? (day.cityDriver / (day.cityDriver + day.courier)) * 100
                  : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div
                    className="w-full rounded-t-md overflow-hidden flex flex-col-reverse min-h-[4px]"
                    style={{ height: `${totalPct}%` }}
                    title={`${day.date}: ${day.cityDriver} city + ${day.courier} courier`}
                  >
                    <div
                      className="w-full bg-brand-500"
                      style={{ height: `${cityPct}%` }}
                    />
                    <div
                      className="w-full bg-orange-400"
                      style={{ height: `${100 - cityPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {stats.dailyVolume.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[10px] text-gray-400 leading-tight"
              >
                {day.date}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-brand-500" />
              <span className="text-xs text-gray-500">City Driver</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-orange-400" />
              <span className="text-xs text-gray-500">Courier Partner</span>
            </div>
          </div>
        </div>

        {/* 3. Two charts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Avg Delivery Time */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Avg Delivery Time
            </h2>
            <div className="flex items-end gap-1.5 h-40">
              {stats.avgDeliveryTime.map((day, i) => {
                const heightPct =
                  maxTime > 0 ? (day.minutes / maxTime) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <div className="text-[9px] text-gray-400 mb-1">
                      {day.minutes}m
                    </div>
                    <div
                      className="w-full bg-brand-500 rounded-t-md transition-all min-h-[4px]"
                      style={{ height: `${heightPct}%` }}
                      title={`${day.date}: ${day.minutes} min`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1.5 mt-2">
              {stats.avgDeliveryTime.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[10px] text-gray-400 leading-tight"
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>

          {/* Cost per Delivery */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Cost per Delivery
            </h2>
            <div className="flex items-end gap-1.5 h-40">
              {stats.costPerDelivery.map((day, i) => {
                const heightPct =
                  maxCost > 0 ? (day.cost / maxCost) * 100 : 0;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full"
                  >
                    <div className="text-[9px] text-gray-400 mb-1">
                      {formatCurrency(day.cost)}
                    </div>
                    <div
                      className="w-full bg-green-500 rounded-t-md transition-all min-h-[4px]"
                      style={{ height: `${heightPct}%` }}
                      title={`${day.date}: ${formatCurrency(day.cost)}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex gap-1.5 mt-2">
              {stats.costPerDelivery.map((day, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[10px] text-gray-400 leading-tight"
                >
                  {day.date}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Driver Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Driver Leaderboard
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pr-2 w-12">Rank</th>
                <th className="pb-3 pr-2">Driver</th>
                <th className="pb-3 pr-2 text-right">Deliveries</th>
                <th className="pb-3 pr-2 text-right">Avg Time</th>
                <th className="pb-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {stats.driverLeaderboard.map((driver, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2.5 pr-2 text-gray-400 font-medium">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-2 font-medium text-gray-900">
                    {driver.name}
                  </td>
                  <td className="py-2.5 pr-2 text-right text-gray-600">
                    <Badge variant="default">{driver.deliveries}</Badge>
                  </td>
                  <td className="py-2.5 pr-2 text-right text-gray-600">
                    {driver.avgTime} min
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="text-amber-500">
                      {renderStars(driver.rating)}
                    </span>
                    <span className="ml-1 text-xs text-gray-400">
                      {driver.rating.toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PerfStatsCard({
  label,
  data,
}: {
  label: string;
  data: { deliveries: number; avgTime: number; onTimeRate: number };
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-5">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{data.deliveries}</p>
      <p className="text-xs text-gray-400 mt-0.5">deliveries</p>
      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
        <span>{data.avgTime} min avg</span>
        <span className="text-gray-300">|</span>
        <span>{Math.round(data.onTimeRate * 100)}% on-time</span>
      </div>
    </div>
  );
}

function renderStars(rating: number): string {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "\u2605".repeat(full) +
    (half ? "\u00BD" : "") +
    "\u2606".repeat(empty)
  );
}
