import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/trades", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load trades");
        const data = await res.json();
        setTrades(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  const stats = useMemo(() => {
    const total = trades.length;
    if (total === 0) {
      return {
        totalPnL: 0,
        winRate: 0,
        totalTrades: 0,
        bestTrade: 0,
        worstTrade: 0,
        wins: 0,
        losses: 0,
        withNotes: 0,
        avgPnL: 0,
      };
    }

    const winsArr = trades.filter((t) => t.pnl > 0);
    const lossesArr = trades.filter((t) => t.pnl < 0);
    const totalPnL = trades.reduce((s, t) => s + (t.pnl || 0), 0);
    const pnls = trades.map((t) => t.pnl || 0);

    return {
      totalPnL,
      winRate: (winsArr.length / total) * 100,
      totalTrades: total,
      bestTrade: Math.max(...pnls),
      worstTrade: Math.min(...pnls),
      wins: winsArr.length,
      losses: lossesArr.length,
      withNotes: trades.filter((t) => t.notes && t.notes.trim()).length,
      avgPnL: totalPnL / total,
    };
  }, [trades]);

  const recent = useMemo(() => {
    return [...trades]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [trades]);

  const needsJournal = useMemo(() => {
    return trades.filter((t) => !t.notes || !t.notes.trim()).length;
  }, [trades]);

  const firstName = user?.name?.split(" ")[0] || "Trader";

  if (loading) {
    return <div className="text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Hey {firstName}, ready to trade smarter?
        </h1>
        <p className="text-slate-400 mt-2">
          Your performance snapshot from real trades.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm">
          {error} — is the backend running on port 5000?
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card
          label="Total P&L"
          value={`${stats.totalPnL >= 0 ? "+" : ""}${stats.totalPnL.toFixed(2)}`}
          sub={
            stats.totalTrades
              ? `${stats.wins}W / ${stats.losses}L`
              : "No trades yet"
          }
          color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}
        />
        <Card
          label="Win Rate"
          value={stats.totalTrades ? `${stats.winRate.toFixed(1)}%` : "—"}
          sub={
            stats.totalTrades
              ? `${stats.totalTrades} trades logged`
              : "Log your first trade"
          }
          color="text-cyan-400"
        />
        <Card
          label="Trades Logged"
          value={String(stats.totalTrades)}
          sub={`${stats.withNotes} with journal notes`}
          color="text-violet-400"
        />
        <Card
          label="Best Trade"
          value={
            stats.totalTrades ? `+${stats.bestTrade.toFixed(2)}` : "—"
          }
          sub={
            stats.totalTrades
              ? `Worst: ${stats.worstTrade.toFixed(2)}`
              : "Highest single P&L"
          }
          color="text-amber-400"
        />
      </div>

      {/* Nudge: trades without notes */}
      {needsJournal > 0 && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/25 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-amber-200 font-medium text-sm">
              {needsJournal} trade{needsJournal > 1 ? "s" : ""} still need journal notes
            </p>
            <p className="text-amber-200/60 text-xs mt-0.5">
              Reflection turns logs into improvement.
            </p>
          </div>
          <Link
            to="/journal"
            className="text-sm font-semibold text-amber-300 hover:text-amber-200 whitespace-nowrap"
          >
            Open Journal →
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent trades */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Recent trades</h3>
            <Link
              to="/journal"
              className="text-sm text-emerald-400 hover:text-emerald-300"
            >
              View journal →
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-400 mb-4">No trades yet</p>
              <Link
                to="/add-trade"
                className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition"
              >
                + Log a Trade
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((t) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between gap-4 bg-slate-800/40 border border-slate-800 rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{t.symbol}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          t.direction === "Long"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {t.direction}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(t.date).toLocaleDateString()}
                      </span>
                      {t.notes?.trim() ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400/80">
                          journaled
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                          no notes
                        </span>
                      )}
                    </div>
                    {t.notes?.trim() ? (
                      <p className="text-sm text-slate-400 mt-1 truncate">
                        {t.notes}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-600 mt-1 italic">
                        Add notes in Journal
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-semibold shrink-0 ${
                      t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {t.pnl >= 0 ? "+" : ""}
                    {t.pnl}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500/15 to-slate-900 border border-emerald-500/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Quick start</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Log the numbers, then write the story in Journal. That’s the TradeVibe loop.
            </p>
            <Link
              to="/add-trade"
              className="block text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 rounded-xl transition"
            >
              + Log a Trade
            </Link>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-1">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Go to
            </h3>
            <NavRow to="/journal" label="Journal" icon="📓" desc="Notes & emotions" />
            <NavRow to="/analytics" label="Analytics" icon="📉" desc="Calendar & stats" />
            <NavRow to="/roadmap" label="Roadmap" icon="🗺️" desc="Learning path" />
          </div>

          {stats.totalTrades > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <p className="text-xs text-slate-500 mb-1">Avg trade</p>
              <p
                className={`text-xl font-bold ${
                  stats.avgPnL >= 0 ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {stats.avgPnL >= 0 ? "+" : ""}
                {stats.avgPnL.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, sub, color }) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-2">{sub}</p>
    </div>
  );
}

function NavRow({ to, label, icon, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/70 transition group"
    >
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-sm text-slate-200 group-hover:text-white font-medium">
          {label}
        </p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}