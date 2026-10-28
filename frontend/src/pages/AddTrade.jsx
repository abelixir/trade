import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTrade() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    symbol: "",
    direction: "Long",
    entryPrice: "",
    exitPrice: "",
    positionSize: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    emotion: "Neutral",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
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
        }),
      });

      if (!res.ok) throw new Error("Failed to save trade");

      navigate("/trades");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Add Trade</h2>
        <p className="text-slate-400 mt-1">Record a new trade in your journal</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Symbol</label>
            <input
              name="symbol"
              value={form.symbol}
              onChange={handleChange}
              required
              placeholder="EURUSD"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Direction</label>
            <select
              name="direction"
              value={form.direction}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
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
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-400 mb-1.5">Emotion</label>
            <select
              name="emotion"
              value={form.emotion}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option>Confident</option>
              <option>Fearful</option>
              <option>Greedy</option>
              <option>Neutral</option>
              <option>Frustrated</option>
              <option>Excited</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Notes / Lesson</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="4"
            placeholder="What did you learn from this trade?"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-medium transition"
          >
            {loading ? "Saving..." : "Save Trade"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/trades")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-3 rounded-xl font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}