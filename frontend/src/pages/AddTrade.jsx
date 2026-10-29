import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    symbol: "",
    direction: "Long",
    entryPrice: "",
    exitPrice: "",
    positionSize: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const previewPnL = () => {
    const entry = Number(form.entryPrice);
    const exit = Number(form.exitPrice);
    const size = Number(form.positionSize);
    if (!entry || !exit || !size) return null;
    const raw =
      form.direction === "Long" ? (exit - entry) * size : (entry - exit) * size;
    return Number(raw.toFixed(2));
  };

  const pnl = previewPnL();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          entryPrice: Number(form.entryPrice),
          exitPrice: Number(form.exitPrice),
          positionSize: Number(form.positionSize),
          notes: "",
          emotion: "Neutral",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save trade");

      // Land on Journal with this trade focused for journaling
      navigate(`/journal?edit=${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Log a Trade</h2>
        <p className="text-slate-400 mt-1">
          Record the numbers first. You’ll add notes on the Journal page.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Symbol</label>
            <input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              required
              placeholder="EURUSD"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Direction</label>
            <select
              name="direction"
              value={form.direction}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Entry Price</label>
            <input
              name="entryPrice"
              type="number"
              step="any"
              value={form.entryPrice}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Exit Price</label>
            <input
              name="exitPrice"
              type="number"
              step="any"
              value={form.exitPrice}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Position Size</label>
            <input
              name="positionSize"
              type="number"
              step="any"
              value={form.positionSize}
              onChange={handleChange}
              required
              placeholder="1.0"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {pnl !== null && (
          <div
            className={`rounded-xl px-4 py-3 border text-sm font-medium ${
              pnl >= 0
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            Estimated P&L: {pnl >= 0 ? "+" : ""}
            {pnl}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-8 py-3 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Saving..." : "Save & Journal →"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/journal")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3 rounded-xl font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}