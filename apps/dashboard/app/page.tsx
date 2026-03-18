export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-2xl">R</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Dashboard
        </h1>
        <p className="text-gray-500 mt-3 max-w-md">
          Manage your orders, menus, and earnings on RWC Delivers.
          <br />
          Coming soon.
        </p>
      </div>
    </div>
  );
}
