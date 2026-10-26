export default function AddTrade() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Add Trade</h2>
        <p className="text-slate-400 mt-1">Record a new trade in your journal</p>
      </div>

      <form className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Symbol</label>
            <input
              type="text"
              placeholder="EURUSD"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Direction</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option>Long</option>
              <option>Short</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Entry Price</label>
            <input
              type="number"
              step="any"
              placeholder="1.0845"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Exit Price</label>
            <input
              type="number"
              step="any"
              placeholder="1.0892"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Position Size</label>
            <input
              type="number"
              placeholder="1.0"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Date</label>
            <input
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Notes / Lesson</label>
          <textarea
            rows="4"
            placeholder="What did you learn from this trade?"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
          ></textarea>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
          >
            Save Trade
          </button>
          <button
            type="button"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-2.5 rounded-lg font-medium transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}