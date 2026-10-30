import { useState, useEffect, useMemo } from "react";

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const token = localStorage.getItem("token");

  // ─── Fetch real trades from backend ───────────────────────────
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/trades", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load trades");

        const data = await res.json();
        setTrades(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTrades();
  }, [token]);

  // ─── Core stats ───────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = trades.length;
    if (total === 0) {
      return {
        totalTrades: 0,
        wins: 0,
        losses: 0,
        breakeven: 0,
        winRate: 0,
        totalPnL: 0,
        avgWin: 0,
        avgLoss: 0,
        profitFactor: 0,
        expectancy: 0,
        bestTrade: 0,
        worstTrade: 0,
        avgPnL: 0,
        longTrades: 0,
        shortTrades: 0,
        longWinRate: 0,
        shortWinRate: 0,
        maxWinStreak: 0,
        maxLossStreak: 0,
      };
    }

    const winsArr = trades.filter((t) => t.pnl > 0);
    const lossesArr = trades.filter((t) => t.pnl < 0);
    const breakeven = trades.filter((t) => t.pnl === 0).length;

    const wins = winsArr.length;
    const losses = lossesArr.length;
    const totalPnL = trades.reduce((s, t) => s + (t.pnl || 0), 0);
    const grossProfit = winsArr.reduce((s, t) => s + t.pnl, 0);
    const grossLoss = Math.abs(lossesArr.reduce((s, t) => s + t.pnl, 0));

    const avgWin = wins ? grossProfit / wins : 0;
    const avgLoss = losses ? grossLoss / losses : 0;
    const profitFactor =
      grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;
    const expectancy = total ? totalPnL / total : 0;

    const bestTrade = Math.max(...trades.map((t) => t.pnl));
    const worstTrade = Math.min(...trades.map((t) => t.pnl));

    const longTrades = trades.filter((t) => t.direction === "Long");
    const shortTrades = trades.filter((t) => t.direction === "Short");
    const longWins = longTrades.filter((t) => t.pnl > 0).length;
    const shortWins = shortTrades.filter((t) => t.pnl > 0).length;

    const sorted = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let curWin = 0;
    let curLoss = 0;

    sorted.forEach((t) => {
      if (t.pnl > 0) {
        curWin++;
        curLoss = 0;
        maxWinStreak = Math.max(maxWinStreak, curWin);
      } else if (t.pnl < 0) {
        curLoss++;
        curWin = 0;
        maxLossStreak = Math.max(maxLossStreak, curLoss);
      } else {
        curWin = 0;
        curLoss = 0;
      }
    });

    return {
      totalTrades: total,
      wins,
      losses,
      breakeven,
      winRate: (wins / total) * 100,
      totalPnL,
      avgWin,
      avgLoss,
      profitFactor,
      expectancy,
      bestTrade,
      worstTrade,
      avgPnL: totalPnL / total,
      longTrades: longTrades.length,
      shortTrades: shortTrades.length,
      longWinRate: longTrades.length ? (longWins / longTrades.length) * 100 : 0,
      shortWinRate: shortTrades.length ? (shortWins / shortTrades.length) * 100 : 0,
      maxWinStreak,
      maxLossStreak,
    };
  }, [trades]);

  // ─── Daily PnL map for calendar ───────────────────────────────
  const dailyPnL = useMemo(() => {
    const map = {};
    trades.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!map[key]) map[key] = { pnl: 0, count: 0 };
      map[key].pnl += t.pnl || 0;
      map[key].count += 1;
    });
    return map;
  }, [trades]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const monthStats = useMemo(() => {
    let pnl = 0;
    let tradesCount = 0;
    Object.entries(dailyPnL).forEach(([key, val]) => {
      const [y, m] = key.split("-").map(Number);
      if (y === year && m === month + 1) {
        pnl += val.pnl;
        tradesCount += val.count;
      }
    });
    return { pnl, tradesCount };
  }, [dailyPnL, year, month]);

  const formatMoney = (n) => {
    const num = Number(n) || 0;
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}`;
  };

  const getDayColor = (pnl) => {
    if (pnl === undefined || pnl === 0) return "bg-slate-800/40 border-slate-800";
    if (pnl > 0) {
      if (pnl >= 100) return "bg-emerald-500/40 border-emerald-500/50";
      if (pnl >= 50) return "bg-emerald-500/25 border-emerald-500/40";
      return "bg-emerald-500/15 border-emerald-500/30";
    }
    if (pnl <= -100) return "bg-rose-500/40 border-rose-500/50";
    if (pnl <= -50) return "bg-rose-500/25 border-rose-500/40";
    return "bg-rose-500/15 border-rose-500/30";
  };

  // Build calendar cells
  const calendarCells = [];
  for (let i = 0; i < startWeekday; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const data = dailyPnL[key];
    const pnl = data?.pnl;
    const count = data?.count || 0;

    calendarCells.push(
      <div
        key={day}
        className={`aspect-square rounded-xl border p-1.5 flex flex-col justify-between transition ${getDayColor(pnl)}`}
        title={data ? `${count} trade(s) · ${formatMoney(pnl)}` : "No trades"}
      >
        <span className="text-xs text-slate-400 font-medium">{day}</span>
        {data && (
          <div className="text-right">
            <div
              className={`text-xs font-semibold leading-tight ${
                pnl > 0 ? "text-emerald-300" : pnl < 0 ? "text-rose-300" : "text-slate-400"
              }`}
            >
              {formatMoney(pnl)}
            </div>
            <div className="text-[10px] text-slate-500">{count}t</div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Analytics</h2>
        <p className="text-slate-400 mt-1">
          Performance calendar & detailed statistics
        </p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">No trades yet</h3>
          <p className="text-slate-400 mb-6">
            Log some trades first to see your performance analytics.
          </p>
          <a Dual
            href="/add-trade"
            className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
          >
            + Log your first trade
          </a>
        </div>
      ) : (
        <>
          {/* Top KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
              label="Profit Factor"
              value={stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
              color="text-cyan-400"
            />
            <StatCard
              label="Expectancy"
              value={formatMoney(stats.expectancy)}
              color={stats.expectancy >= 0 ? "text-emerald-400" : "text-rose-400"}
            />
            <StatCard
              label="Avg Win"
              value={formatMoney(stats.avgWin)}
              color="text-emerald-400"
            />
            <StatCard
              label="Avg Loss"
              value={`-${stats.avgLoss.toFixed(2)}`}
              color="text-rose-400"
            />
          </div>

          <div className="grid lg:grid-cols-5 gap-6 mb-8">
            {/* Calendar */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                >
                  ←
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">{monthLabel}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {monthStats.tradesCount} trades ·{" "}
                    <span className={monthStats.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {formatMoney(monthStats.pnl)}
                    </span>
                  </p>
                </div>
                <button
                  onClick={nextMonth}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="text-center text-[11px] text-slate-500 font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1.5">{calendarCells}</div>

              <div className="flex items-center justify-center gap-4 mt-5 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-500/40" />
                  Profit
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-rose-500/30 border border-rose-500/40" />
                  Loss
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-slate-800/40 border border-slate-800" />
                  No trade
                </div>
              </div>
            </div>

            {/* Side stats */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Trade Breakdown
                </h3>
                <Row label="Total Trades" value={stats.totalTrades} />
                <Row label="Wins" value={stats.wins} color="text-emerald-400" />
                <Row label="Losses" value={stats.losses} color="text-rose-400" />
                <Row label="Breakeven" value={stats.breakeven} />
                <div className="border-t border-slate-800 pt-3" />
                <Row label="Best Trade" value={formatMoney(stats.bestTrade)} color="text-emerald-400" />
                <Row label="Worst Trade" value={formatMoney(stats.worstTrade)} color="text-rose-400" />
                <Row label="Avg Trade" value={formatMoney(stats.avgPnL)} />
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  Direction & Streaks
                </h3>
                <Row
                  label={`Long (${stats.longTrades})`}
                  value={`${stats.longWinRate.toFixed(0)}% WR`}
                />
                <Row
                  label={`Short (${stats.shortTrades})`}
                  value={`${stats.shortWinRate.toFixed(0)}% WR`}
                />
                <div className="border-t border-slate-800 pt-3" />
                <Row label="Max Win Streak" value={stats.maxWinStreak} color="text-emerald-400" />
                <Row label="Max Loss Streak" value={stats.maxLossStreak} color="text-rose-400" />
              </div>
            </div>
          </div>

          {/* Insight cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <InsightCard
              title="Risk / Reward"
              value={stats.avgLoss > 0 ? (stats.avgWin / stats.avgLoss).toFixed(2) : "—"}
              subtitle="Avg Win ÷ Avg Loss"
            />
            <InsightCard
              title="Win Rate Needed"
              value={
                stats.avgWin + stats.avgLoss > 0
                  ? `${((stats.avgLoss / (stats.avgWin + stats.avgLoss)) * 100).toFixed(0)}%`
                  : "—"
              }
              subtitle="Break-even win rate"
            />
            <InsightCard
              title="Consistency"
              value={`${stats.maxWinStreak} / ${stats.maxLossStreak}`}
              subtitle="Best win streak / worst loss streak"
            />
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
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

function InsightCard({ title, value, subtitle }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
      <p className="text-xs text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}