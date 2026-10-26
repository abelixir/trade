export default function Dashboard() {
  const stats = [
    { label: "Total P&L", value: "+$2,450.00", change: "+12.4%", positive: true },
    { label: "Win Rate", value: "64.2%", change: "+2.1%", positive: true },
    { label: "Total Trades", value: "87", change: "+5 this week", positive: true },
    { label: "Avg. R:R", value: "1.85", change: "-0.1", positive: false },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-slate-400 mt-1">Overview of your trading performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5"
          >
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold mt-1 text-white">{stat.value}</p>
            <p
              className={`text-xs mt-2 ${
                stat.positive ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Placeholder sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-72 flex items-center justify-center">
          <p className="text-slate-500">Equity Curve Chart (coming soon)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-72 flex items-center justify-center">
          <p className="text-slate-500">Recent Trades (coming soon)</p>
        </div>
      </div>
    </div>
  );
}