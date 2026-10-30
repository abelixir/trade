import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTrades } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await getTrades();
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const stats = useMemo(() => {
    if (trades.length === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        totalTrades: 0,
        wins: 0,
        losses: 0,
        avgWin: 0,
        avgLoss: 0,
        bestTrade: 0,
        worstTrade: 0,
        profitFactor: 0,
      };
    }

    const winsArr = trades.filter((t) => t.pnl > 0);
    const lossesArr = trades.filter((t) => t.pnl < 0);
    const totalPnL = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const grossProfit = winsArr.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(lossesArr.reduce((sum, t) => sum + t.pnl, 0));

    return {
      totalPnL,
      winRate: (winsArr.length / trades.length) * 100,
      totalTrades: trades.length,
      wins: winsArr.length,
      losses: lossesArr.length,
      avgWin: winsArr.length ? grossProfit / winsArr.length : 0,
      avgLoss: lossesArr.length ? grossLoss / lossesArr.length : 0,
      bestTrade: Math.max(...trades.map((t) => t.pnl)),
      worstTrade: Math.min(...trades.map((t) => t.pnl)),
      profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
    };
  }, [trades]);

  const recentTrades = useMemo(() => {
    return [...trades]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [trades]);

  // Simple equity curve data
  const equityCurve = useMemo(() => {
    const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    let balance = 0;
    return sorted.map((t) => {
      balance += t.pnl || 0;
      return balance;
    });
  }, [trades]);

  const formatMoney = (n) => {
    const num = Number(n) || 0;
    return `${num >= 0 ? "+" : ""}${num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hey {user?.name?.split(" ")[0] || "Trader"}, ready to trade smarter?
        </h1>
        <p className="text-slate-400 mt-2">Here's your performance overview.</p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-xl font-semibold text-white mb-2">No trades yet</h3>
          <p className="text-slate-400 mb-6">
            Start logging trades to see your real performance here.
          </p>
          <Link
            to="/add-trade"
            className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
          >
            + Log your first trade
          </Link>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total P&L"
              value={formatMoney(stats.totalPnL)}
              color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}
            />
            <StatCard
              label="Win Rate"
              value={`${stats.winRate.toFixed(1)}%`}
              color="text-white"
            />
            <StatCard
              label="Total Trades"
              value={stats.totalTrades}
              color="text-violet-400"
            />
            <StatCard
              label="Profit Factor"
              value={stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
              color="text-cyan-400"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Equity Curve (Simple) */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">
                Equity Curve
              </h3>

              {equityCurve.length > 1 ? (
                <div className="h-48 flex items-end gap-1">
                  {equityCurve.map((value, i) => {
                    const max = Math.max(...equityCurve.map(Math.abs), 1);
                    const height = Math.max((Math.abs(value) / max) * 100, 4);
                    const isPositive = value >= 0;

                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col justify-end"
                        title={`$${value.toFixed(2)}`}
                      >
                        <div
                          className={`w-full rounded-t transition-all ${
                            isPositive ? "bg-emerald-500/70" : "bg-rose-500/70"
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500">
                  Need more trades to show equity curve
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Quick Stats
              </h3>
              <Row label="Wins" value={stats.wins} color="text-emerald-400" />
              <Row label="Losses" value={stats.losses} color="text-rose-400" />
              <Row label="Avg Win" value={formatMoney(stats.avgWin)} color="text-emerald-400" />
              <Row label="Avg Loss" value={`-${stats.avgLoss.toFixed(2)}`} color="text-rose-400" />
              <Row label="Best Trade" value={formatMoney(stats.bestTrade)} color="text-emerald-400" />
              <Row label="Worst Trade" value={formatMoney(stats.worstTrade)} color="text-rose-400" />
            </div>
          </div>

          {/* Recent Trades */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Recent Trades
              </h3>
              <Link
                to="/journal"
                className="text-sm text-emerald-400 hover:text-emerald-300 transition"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-slate-800">
              {recentTrades.map((trade) => (
                <div
                  key={trade._id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        trade.pnl >= 0 ? "bg-emerald-400" : "bg-rose-400"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-white">{trade.symbol}</p>
                      <p className="text-xs text-slate-500">
                        {trade.direction} · {new Date(trade.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {formatMoney(trade.pnl)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Row({ label, value, color = "text-white" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}