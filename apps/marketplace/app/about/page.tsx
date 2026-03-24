import { Button } from "@rwc/ui";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        About RWC Delivers
      </h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-600 leading-relaxed">
          RWC Delivers is a City of Redwood City program that connects residents
          with the city&apos;s best independent restaurants for delivery. Unlike
          national platforms, we&apos;re built for our community.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          How It&apos;s Different
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 not-prose">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Transparent Pricing</h3>
            <p className="text-sm text-gray-500 mt-1">
              $7.50 flat delivery fee. No hidden service fees. No surge pricing. Ever.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-civic-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-civic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">100% to Restaurants</h3>
            <p className="text-sm text-gray-500 mt-1">
              No commission on food. Restaurants keep every dollar of your order.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">City Program</h3>
            <p className="text-sm text-gray-500 mt-1">
              Run by Redwood City. Your data stays local. Your tips go directly to drivers.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="w-10 h-10 bg-civic-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-civic-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Local Only</h3>
            <p className="text-sm text-gray-500 mt-1">
              15 curated Redwood City restaurants, including Michelin-recommended and James Beard semifinalists.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
          Pricing Comparison
        </h2>

        <div className="not-prose overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
                <th className="text-center px-4 py-3 font-semibold text-brand-700">RWC Delivers</th>
                <th className="text-center px-4 py-3 font-medium text-gray-600">DoorDash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 text-gray-600">Delivery Fee</td>
                <td className="px-4 py-3 text-center font-medium text-brand-700">$7.50 flat</td>
                <td className="px-4 py-3 text-center text-gray-500">$2.99-$7.99+</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">Service Fee</td>
                <td className="px-4 py-3 text-center font-medium text-brand-700">$0</td>
                <td className="px-4 py-3 text-center text-gray-500">15%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">Surge Pricing</td>
                <td className="px-4 py-3 text-center font-medium text-brand-700">Never</td>
                <td className="px-4 py-3 text-center text-gray-500">Up to 2x</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-600">Restaurant Commission</td>
                <td className="px-4 py-3 text-center font-medium text-brand-700">0%</td>
                <td className="px-4 py-3 text-center text-gray-500">15-30%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/">
          <Button size="lg">Order Now</Button>
        </Link>
      </div>
    </div>
  );
}
