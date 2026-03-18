"use client";

import { getMockEarnings, getMockCustomers } from "../../lib/mock-data";
import { formatCurrency } from "@rwc/shared";
import { Badge } from "@rwc/ui";

const earnings = getMockEarnings();
const customers = getMockCustomers();

export default function EarningsPage() {
  const maxRevenue = Math.max(...earnings.dailyData.map((d) => d.revenue));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Earnings &amp; Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your revenue, top items, and customer activity.
          </p>
        </div>

        {/* 1. Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatsCard label="Today" data={earnings.today} />
          <StatsCard label="This Week" data={earnings.thisWeek} />
          <StatsCard label="This Month" data={earnings.thisMonth} />
        </div>

        {/* 2. DoorDash Comparison Card */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Fee Comparison
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              This month on RWC Delivers, you paid{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(earnings.doordashComparison.rwcFees)}
              </span>{" "}
              in fees.
            </p>
            <p className="text-sm text-gray-600">
              On DoorDash at 25%, you would have paid{" "}
              <span className="font-semibold text-gray-900">
                {formatCurrency(earnings.doordashComparison.doordashFees)}
              </span>
              .
            </p>

            {/* Visual bar comparison */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-24 shrink-0">
                  RWC Delivers
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{
                      width: `${(earnings.doordashComparison.rwcFees / earnings.doordashComparison.doordashFees) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 w-20 text-right">
                  {formatCurrency(earnings.doordashComparison.rwcFees)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500 w-24 shrink-0">
                  DoorDash
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full w-full" />
                </div>
                <span className="text-xs font-medium text-gray-700 w-20 text-right">
                  {formatCurrency(earnings.doordashComparison.doordashFees)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-lg font-bold text-green-600">
              You saved {formatCurrency(earnings.doordashComparison.saved)}
            </p>
          </div>
        </div>

        {/* 3. Revenue Chart (CSS bars) */}
        <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Daily Revenue — Last 14 Days
          </h2>
          <div className="flex items-end gap-1.5 h-48">
            {earnings.dailyData.map((day, i) => {
              const heightPct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div
                    className="w-full bg-brand-500 rounded-t-md transition-all min-h-[4px]"
                    style={{ height: `${heightPct}%` }}
                    title={`${day.date}: ${formatCurrency(day.revenue)}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-1.5 mt-2">
            {earnings.dailyData.map((day, i) => (
              <div
                key={i}
                className="flex-1 text-center text-[10px] text-gray-400 leading-tight"
              >
                {day.date}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 4. Top Selling Items */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Top Selling Items
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pr-2 w-8">#</th>
                  <th className="pb-3 pr-2">Item</th>
                  <th className="pb-3 pr-2 text-right">Qty</th>
                  <th className="pb-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {earnings.topItems.map((item, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="py-2.5 pr-2 text-gray-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="py-2.5 pr-2 font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-2.5 pr-2 text-right text-gray-600">
                      <Badge variant="default">{item.quantity}</Badge>
                    </td>
                    <td className="py-2.5 text-right text-gray-900 font-medium">
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Recent Customers */}
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Recent Customers
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-3 pr-2">Customer</th>
                  <th className="pb-3 pr-2 text-right">Orders</th>
                  <th className="pb-3 pr-2 text-right">Total Spent</th>
                  <th className="pb-3 text-right">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="border-t border-gray-100">
                    <td className="py-2.5 pr-2">
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="py-2.5 pr-2 text-right text-gray-600">
                      {c.orderCount}
                    </td>
                    <td className="py-2.5 pr-2 text-right text-gray-900 font-medium">
                      {formatCurrency(c.totalSpent)}
                    </td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">
                      {c.lastOrderDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  label,
  data,
}: {
  label: string;
  data: { orders: number; revenue: number; tips: number };
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-5">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {formatCurrency(data.revenue)}
      </p>
      <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
        <span>{data.orders} orders</span>
        <span className="text-gray-300">|</span>
        <span>{formatCurrency(data.tips)} tips</span>
      </div>
    </div>
  );
}
