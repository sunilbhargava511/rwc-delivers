"use client";

import { Badge, Button } from "@rwc/ui";
import { getMockShifts, getMockDrivers } from "../../lib/mock-data";

const WEEK_DATES = [
  { date: "2026-03-16", label: "Mon", fullLabel: "Mon 3/16" },
  { date: "2026-03-17", label: "Tue", fullLabel: "Tue 3/17" },
  { date: "2026-03-18", label: "Wed", fullLabel: "Wed 3/18" },
  { date: "2026-03-19", label: "Thu", fullLabel: "Thu 3/19" },
  { date: "2026-03-20", label: "Fri", fullLabel: "Fri 3/20" },
  { date: "2026-03-21", label: "Sat", fullLabel: "Sat 3/21" },
  { date: "2026-03-22", label: "Sun", fullLabel: "Sun 3/22" },
];

const TODAY = "2026-03-18";

const shiftStatusStyles: Record<string, string> = {
  scheduled: "bg-gray-100 text-gray-700",
  active: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-700",
  no_show: "bg-red-100 text-red-700",
};

const shiftStatusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  active: "Active",
  completed: "Completed",
  no_show: "No Show",
};

export default function SchedulePage() {
  const shifts = getMockShifts();

  // Build a lookup: date -> slotType -> shifts[]
  const shiftsByDateSlot: Record<string, Record<string, typeof shifts>> = {};
  for (const day of WEEK_DATES) {
    shiftsByDateSlot[day.date] = { lunch: [], dinner: [], weekend: [] };
  }
  for (const shift of shifts) {
    if (shiftsByDateSlot[shift.shift_date]) {
      shiftsByDateSlot[shift.shift_date][shift.shift_type].push(shift);
    }
  }

  // Today's shifts
  const todayShifts = shifts.filter((s) => s.shift_date === TODAY);

  // Coverage summary: count drivers per slot per day
  const coverageSummary = WEEK_DATES.map((day) => {
    const dayShifts = shifts.filter((s) => s.shift_date === day.date);
    const lunchCount = dayShifts.filter(
      (s) => s.shift_type === "lunch" || s.shift_type === "weekend"
    ).length;
    const dinnerCount = dayShifts.filter(
      (s) => s.shift_type === "dinner" || s.shift_type === "weekend"
    ).length;
    return { ...day, lunchCount, dinnerCount };
  });

  function renderShiftChip(shift: (typeof shifts)[number]) {
    const isActive = shift.status === "active";
    return (
      <div
        key={shift.id}
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${shiftStatusStyles[shift.status]}`}
      >
        {isActive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        )}
        {shift.driver_name}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Mar 16 - 22, 2026</p>
        </div>
        <Button variant="outline">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          This Week
        </Button>
      </div>

      {/* Weekly Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden mb-8">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {WEEK_DATES.map((day) => (
            <div
              key={day.date}
              className={`px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                day.date === TODAY
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-500"
              }`}
            >
              <span className="hidden sm:inline">{day.fullLabel}</span>
              <span className="sm:hidden">{day.label}</span>
            </div>
          ))}
        </div>

        {/* Lunch row */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEK_DATES.map((day) => {
            const isWeekend = day.date === "2026-03-21" || day.date === "2026-03-22";
            const slotShifts = isWeekend
              ? shiftsByDateSlot[day.date].weekend
              : shiftsByDateSlot[day.date].lunch;
            return (
              <div
                key={day.date}
                className={`p-2 min-h-[80px] border-r border-gray-100 last:border-r-0 ${
                  day.date === TODAY ? "bg-brand-50/30" : "bg-orange-50/30"
                }`}
              >
                <p className="text-[10px] font-medium text-orange-600 uppercase mb-1.5">
                  Lunch 11-2
                </p>
                <div className="flex flex-col gap-1">
                  {slotShifts.map((s) => renderShiftChip(s))}
                  {slotShifts.length === 0 && (
                    <span className="text-[10px] text-gray-400 italic">
                      No coverage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dinner row */}
        <div className="grid grid-cols-7">
          {WEEK_DATES.map((day) => {
            const isWeekend = day.date === "2026-03-21" || day.date === "2026-03-22";
            const slotShifts = isWeekend
              ? shiftsByDateSlot[day.date].weekend
              : shiftsByDateSlot[day.date].dinner;
            return (
              <div
                key={day.date}
                className={`p-2 min-h-[80px] border-r border-gray-100 last:border-r-0 ${
                  day.date === TODAY ? "bg-brand-50/30" : "bg-indigo-50/30"
                }`}
              >
                <p className="text-[10px] font-medium text-indigo-600 uppercase mb-1.5">
                  {isWeekend ? "All Day" : "Dinner 5-9"}
                </p>
                <div className="flex flex-col gap-1">
                  {slotShifts.map((s) => renderShiftChip(s))}
                  {slotShifts.length === 0 && (
                    <span className="text-[10px] text-gray-400 italic">
                      No coverage
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Shifts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Today&apos;s Shifts
            <span className="text-sm font-normal text-gray-500 ml-2">
              Wednesday, March 18
            </span>
          </h2>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Driver
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Time
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                    Deliveries
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {shift.driver_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {shift.shift_start} - {shift.shift_end}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          shift.status === "active"
                            ? "success"
                            : shift.status === "completed"
                            ? "brand"
                            : shift.status === "no_show"
                            ? "error"
                            : "default"
                        }
                      >
                        {shiftStatusLabels[shift.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-right">
                      {shift.deliveries_completed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coverage Summary */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Coverage Summary
          </h2>
          <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-4">
            <div className="space-y-3">
              {coverageSummary.map((day) => (
                <div
                  key={day.date}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                    day.date === TODAY ? "bg-brand-50" : ""
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      day.date === TODAY ? "text-brand-700" : "text-gray-700"
                    }`}
                  >
                    {day.fullLabel}
                    {day.date === TODAY && (
                      <span className="ml-1 text-xs text-brand-500">
                        (today)
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-400" />
                      <span className="text-xs text-gray-500">
                        {day.lunchCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-xs text-gray-500">
                        {day.dinnerCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-xs text-gray-500">Lunch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="text-xs text-gray-500">Dinner</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
