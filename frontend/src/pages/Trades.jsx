const mockTrades = [
  {
    id: 1,
    symbol: "EURUSD",
    type: "Long",
    entry: 1.0845,
    exit: 1.0892,
    pnl: 470,
    date: "2026-10-24",
    status: "Win",
  },
  {
    id: 2,
    symbol: "XAUUSD",
    type: "Short",
    entry: 2650.2,
    exit: 2641.8,
    pnl: 840,
    date: "2026-10-23",
    status: "Win",
  },
  {
    id: 3,
    symbol: "NAS100",
    type: "Long",
    entry: 18240,
    exit: 18110,
    pnl: -650,
    date: "2026-10-22",
    status: "Loss",
  },
];

export default function Trades() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Trades</h2>
          <p className="text-slate-400 mt-1">All your recorded trades</p>
        </div>
        <a
          href="/add-trade"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Trade
        </a>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-left px-6 py-3 font-medium">Symbol</th>
              <th className="text-left px-6 py-3 font-medium">Type</th>
              <th className="text-right px-6 py-3 font-medium">Entry</th>
              <th className="text-right px-6 py-3 font-medium">Exit</th>
              <th className="text-right px-6 py-3 font-medium">P&L</th>
              <th className="text-center px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-slate-800/40 transition">
                <td className="px-6 py-4 text-slate-300">{trade.date}</td>
                <td className="px-6 py-4 font-medium text-white">{trade.symbol}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      trade.type === "Long"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-300">{trade.entry}</td>
                <td className="px-6 py-4 text-right text-slate-300">{trade.exit}</td>
                <td
                  className={`px-6 py-4 text-right font-medium ${
                    trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {trade.pnl >= 0 ? "+" : ""}${trade.pnl}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      trade.status === "Win"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}