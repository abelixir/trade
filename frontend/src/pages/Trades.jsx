import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this trade?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/trades/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrades(trades.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading trades...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Trades</h2>
          <p className="text-slate-400 mt-1">All your recorded trades</p>
        </div>
        <Link
          to="/add-trade"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
        >
          + Add Trade
        </Link>
      </div>

      {trades.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <p className="text-slate-400 mb-4">No trades yet</p>
          <Link to="/add-trade" className="text-emerald-400 hover:underline">
            Add your first trade →
          </Link>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Date</th>
                <th className="text-left px-6 py-4 font-medium">Symbol</th>
                <th className="text-left px-6 py-4 font-medium">Direction</th>
                <th className="text-right px-6 py-4 font-medium">Entry</th>
                <th className="text-right px-6 py-4 font-medium">Exit</th>
                <th className="text-right px-6 py-4 font-medium">P&L</th>
                <th className="text-center px-6 py-4 font-medium">Emotion</th>
                <th className="text-center px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {trades.map((trade) => (
                <tr key={trade._id} className="hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(trade.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{trade.symbol}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        trade.direction === "Long"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {trade.direction}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-300">{trade.entryPrice}</td>
                  <td className="px-6 py-4 text-right text-slate-300">{trade.exitPrice}</td>
                  <td
                    className={`px-6 py-4 text-right font-medium ${
                      trade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {trade.pnl >= 0 ? "+" : ""}
                    {trade.pnl}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400 text-xs">
                    {trade.emotion}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(trade._id)}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}