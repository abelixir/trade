import { useEffect, useState } from "react";

export default function Journal() {
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
        setTrades(data.filter((t) => t.notes && t.notes.trim() !== ""));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  if (loading) return <div className="text-slate-400">Loading journal...</div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
        <p className="text-slate-400 mt-1">Your thoughts, emotions and lessons from trades</p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <p className="text-slate-400">No journal entries yet.</p>
          <p className="text-slate-500 text-sm mt-2">Add notes when you create a trade.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {trades.map((trade) => (
            <div key={trade._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-white">{trade.symbol}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      trade.direction === "Long"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {trade.direction}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(trade.date).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {trade.pnl >= 0 ? "+" : ""}
                  {trade.pnl}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{trade.notes}</p>
              <div className="mt-3 text-xs text-slate-500">Emotion: {trade.emotion}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}