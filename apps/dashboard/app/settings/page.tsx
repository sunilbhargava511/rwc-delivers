"use client";

import { useState } from "react";
import { Button } from "@rwc/ui";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIME_OPTIONS = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
];

interface HoursEntry {
  open: string;
  close: string;
  closed: boolean;
}

interface StaffMember {
  name: string;
  role: "Owner" | "Manager" | "Kitchen";
  email: string;
  status: "Active" | "Invited";
}

const initialHours: Record<string, HoursEntry> = {
  Monday: { open: "11:00 AM", close: "9:00 PM", closed: false },
  Tuesday: { open: "11:00 AM", close: "9:00 PM", closed: false },
  Wednesday: { open: "11:00 AM", close: "9:00 PM", closed: false },
  Thursday: { open: "11:00 AM", close: "9:30 PM", closed: false },
  Friday: { open: "11:00 AM", close: "10:00 PM", closed: false },
  Saturday: { open: "10:00 AM", close: "10:00 PM", closed: false },
  Sunday: { open: "10:00 AM", close: "8:00 PM", closed: false },
};

const initialStaff: StaffMember[] = [
  { name: "Oscar Ramirez", role: "Owner", email: "oscar@laviga.com", status: "Active" },
  { name: "Maria Gonzalez", role: "Manager", email: "maria@laviga.com", status: "Active" },
  { name: "Carlos Mendez", role: "Kitchen", email: "carlos@laviga.com", status: "Active" },
];

const initialTags = ["Mexican", "Seafood", "Tacos", "Ceviche"];

export default function SettingsPage() {
  const [restaurantName, setRestaurantName] = useState(
    "La Viga Seafood & Cocina Mexicana"
  );
  const [description, setDescription] = useState(
    "Authentic Mexican seafood restaurant serving fresh ceviche, fish tacos, and traditional cocina dishes. Family-owned since 2018."
  );
  const [phone, setPhone] = useState("(650) 679-8141");
  const [cuisineTags, setCuisineTags] = useState(initialTags);
  const [prepTime, setPrepTime] = useState(30);
  const [hours, setHours] = useState<Record<string, HoursEntry>>(initialHours);
  const [staff] = useState<StaffMember[]>(initialStaff);

  // Notification toggles
  const [notifOrderSMS, setNotifOrderSMS] = useState(true);
  const [notifOrderPush, setNotifOrderPush] = useState(true);
  const [notifDailyEmail, setNotifDailyEmail] = useState(false);

  function removeTag(tag: string) {
    setCuisineTags((prev) => prev.filter((t) => t !== tag));
  }

  function updateHours(day: string, field: keyof HoursEntry, value: string | boolean) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your restaurant profile, hours, staff, and notifications.
          </p>
        </div>

        {/* 1. Restaurant Profile */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Restaurant Profile
          </h2>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Address (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value="1772 Broadway St, Redwood City, CA 94063"
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Contact support to update your address.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            {/* Cuisine Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {cuisineTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-brand-50 text-brand-700 text-sm font-medium rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 text-brand-400 hover:text-brand-700"
                      aria-label={`Remove ${tag}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Default Prep Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Prep Time (minutes)
              </label>
              <input
                type="number"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                min={5}
                max={120}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <Button>Save Profile</Button>
          </div>
        </section>

        {/* 2. Operating Hours */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Operating Hours
          </h2>
          <div className="space-y-3">
            {DAYS.map((day) => {
              const entry = hours[day];
              return (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-gray-50 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700 w-28 shrink-0">
                    {day}
                  </span>

                  {/* Closed toggle */}
                  <label className="inline-flex items-center gap-2 cursor-pointer shrink-0">
                    <span className="text-xs text-gray-500">Closed</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={entry.closed}
                      onClick={() => updateHours(day, "closed", !entry.closed)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        entry.closed ? "bg-red-400" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          entry.closed ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>

                  {!entry.closed && (
                    <div className="flex items-center gap-2 flex-1">
                      <select
                        value={entry.open}
                        onChange={(e) => updateHours(day, "open", e.target.value)}
                        className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-400 text-sm">to</span>
                      <select
                        value={entry.close}
                        onChange={(e) => updateHours(day, "close", e.target.value)}
                        className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {entry.closed && (
                    <span className="text-sm text-red-400 italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <Button>Save Hours</Button>
          </div>
        </section>

        {/* 3. Staff */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-gray-900">Staff</h2>
            <Button size="sm" variant="outline">
              Invite Staff
            </Button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="pb-3 pr-2">Name</th>
                <th className="pb-3 pr-2">Role</th>
                <th className="pb-3 pr-2">Email</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.email} className="border-t border-gray-100">
                  <td className="py-3 pr-2 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="py-3 pr-2 text-gray-600">{s.role}</td>
                  <td className="py-3 pr-2 text-gray-500">{s.email}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 4. Notifications */}
        <section className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Notifications
          </h2>
          <div className="space-y-4">
            <ToggleRow
              label="New order SMS"
              description="Get a text message when a new order comes in."
              checked={notifOrderSMS}
              onChange={setNotifOrderSMS}
            />
            <ToggleRow
              label="New order push notification"
              description="Receive a push notification for every new order."
              checked={notifOrderPush}
              onChange={setNotifOrderPush}
            />
            <ToggleRow
              label="Daily earnings email"
              description="Receive a daily summary of your earnings by email."
              checked={notifDailyEmail}
              onChange={setNotifDailyEmail}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${
          checked ? "bg-brand-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
