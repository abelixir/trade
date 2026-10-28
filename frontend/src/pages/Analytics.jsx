import { useEffect, useState } from "react";

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/trades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  if (loading) return <div className="text-slate-400">Loading analytics...</div>;

  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.pnl > 0).length;
  const losses = trades.filter((t) => t.pnl < 0).length;
  const winRate = totalTrades ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0).toFixed(2);
  const avgWin = wins ? (trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins).toFixed(2) : 0;
  const avgLoss = losses ? (trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) / losses).toFixed(2) : 0;

  const stats = [
    { label: "Total P&L", value: `${totalPnL >= 0 ? "+" : ""}${totalPnL}`, color: totalPnL >= 0 ? "text-emerald-400" : "text-rose-400" },
    { label: "Win Rate", value: `${winRate}%`, color: "text-white" },
    { label: "Total Trades", value: totalTrades, color: "text-white" },
    { label: "Wins / Losses", value: `${wins} / ${losses}`, color: "text-white" },
    { label: "Average Win", value: `+${avgWin}`, color: "text-emerald-400" },
    { label: "Average Loss", value: avgLoss, color: "text-rose-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-slate-400 mt-1">Deep insights into your trading performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {totalTrades === 0 && (
        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          Add some trades to see analytics
        </div>
      )}
    </div>
  );
}