// app/dashboard/page.tsx
export default function DashboardPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Add your dashboard cards here */}
          <div className="p-6 bg-background/50 backdrop-blur-lg rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold">Account Balance</h3>
            <p className="text-2xl mt-2">$25,000</p>
          </div>
          {/* More cards... */}
        </div>
      </div>
    );
  }