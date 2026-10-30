import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getTrades, updateTrade, deleteTrade } from "../services/api";

const EMOTIONS = ["Confident", "Fearful", "Greedy", "Neutral", "Frustrated", "Excited"];
const FILTER_EMOTIONS = ["All", ...EMOTIONS];
const DIRECTIONS = ["All", "Long", "Short"];

const emotionStyles = {
  Confident: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Fearful: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Greedy: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Neutral: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  Frustrated: "bg-rose-500/15 text-rose-400 border-rose-500/30",
  Excited: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};

const emotionEmoji = {
  Confident: "💪",
  Fearful: "😰",
  Greedy: "🤑",
  Neutral: "😐",
  Frustrated: "😤",
  Excited: "🔥",
};

export default function Journal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const editId = searchParams.get("edit");

  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("All");
  const [directionFilter, setDirectionFilter] = useState("All");

  const [activeId, setActiveId] = useState(null);
  const [draftNotes, setDraftNotes] = useState("");
  const [draftEmotion, setDraftEmotion] = useState("Neutral");
  const [saving, setSaving] = useState(false);

  const fetchTrades = async () => {
    try {
      setError("");
      const data = await getTrades();
      setTrades(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    if (!editId || trades.length === 0) return;
    const trade = trades.find((t) => t._id === editId);
    if (trade) {
      openEditor(trade);
      setSearchParams({});
    }
  }, [editId, trades]);

  const openEditor = (trade) => {
    setActiveId(trade._id);
    setDraftNotes(trade.notes || "");
    setDraftEmotion(trade.emotion || "Neutral");
  };

  const closeEditor = () => {
    setActiveId(null);
    setDraftNotes("");
    setDraftEmotion("Neutral");
  };

  const saveJournal = async (id) => {
    setSaving(true);
    try {
      const updated = await updateTrade(id, {
        notes: draftNotes.trim(),
        emotion: draftEmotion,
      });
      setTrades((prev) => prev.map((t) => (t._id === id ? updated : t)));
      closeEditor();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this trade from your journal?")) return;
    try {
      await deleteTrade(id);
      setTrades((prev) => prev.filter((t) => t._id !== id));
      if (activeId === id) closeEditor();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = useMemo(() => {
    return trades
      .filter((e) => {
        const notes = e.notes || "";
        const matchSearch =
          !search ||
          notes.toLowerCase().includes(search.toLowerCase()) ||
          (e.symbol || "").toLowerCase().includes(search.toLowerCase());
        const matchEmotion = emotionFilter === "All" || e.emotion === emotionFilter;
        const matchDirection = directionFilter === "All" || e.direction === directionFilter;
        return matchSearch && matchEmotion && matchDirection;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [trades, search, emotionFilter, directionFilter]);

  const stats = useMemo(() => {
    const wins = filtered.filter((e) => e.pnl > 0).length;
    const losses = filtered.filter((e) => e.pnl < 0).length;
    const totalPnL = filtered.reduce((s, e) => s + (e.pnl || 0), 0);
    const withNotes = filtered.filter((e) => e.notes && e.notes.trim()).length;
    return { count: filtered.length, wins, losses, totalPnL, withNotes };
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Trading Journal</h2>
          <p className="text-slate-400 mt-1">
            Reflect on each trade — emotion, notes, and lessons
          </p>
        </div>
        <Link
          to="/add-trade"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20 text-center"
        >
          + Log a Trade
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Trades" value={stats.count} />
        <Stat label="Wins" value={stats.wins} color="text-emerald-400" />
        <Stat label="Losses" value={stats.losses} color="text-rose-400" />
        <Stat
          label="Net P&L"
          value={`${stats.totalPnL >= 0 ? "+" : ""}${stats.totalPnL.toFixed(2)}`}
          color={stats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes or symbol..."
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <div className="flex flex-wrap gap-2">
          {FILTER_EMOTIONS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setEmotionFilter(em)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                emotionFilter === em
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600"
              }`}
            >
              {em === "All" ? "All emotions" : `${emotionEmoji[em]} ${em}`}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {DIRECTIONS.map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => setDirectionFilter(dir)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                directionFilter === dir
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-400 border-slate-700 hover:border-slate-600"
              }`}
            >
              {dir === "All" ? "All directions" : dir}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <p className="text-slate-400 text-lg mb-2">No trades yet</p>
          <p className="text-slate-500 text-sm mb-6">
            Log a trade first, then come back here to write your notes.
          </p>
          <Link
            to="/add-trade"
            className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl font-semibold transition"
          >
            + Log a Trade
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((entry) => {
            const isEditing = activeId === entry._id;
            const hasNotes = entry.notes && entry.notes.trim();

            return (
              <article
                key={entry._id}
                className={`bg-slate-900 border rounded-2xl overflow-hidden transition ${
                  isEditing
                    ? "border-emerald-500/40 ring-1 ring-emerald-500/20"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-white text-lg">{entry.symbol}</span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                        entry.direction === "Long"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {entry.direction}
                    </span>
                    {entry.emotion && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-lg border ${
                          emotionStyles[entry.emotion] || emotionStyles.Neutral
                        }`}
                      >
                        {emotionEmoji[entry.emotion]} {entry.emotion}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold text-lg ${
                        entry.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {entry.pnl >= 0 ? "+" : ""}
                      {entry.pnl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(entry._id)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="px-5 py-3 flex flex-wrap gap-4 text-xs text-slate-500 border-b border-slate-800/80">
                  <span>Entry: {entry.entryPrice}</span>
                  <span>Exit: {entry.exitPrice}</span>
                  <span>Size: {entry.positionSize}</span>
                </div>

                <div className="px-5 py-5">
                  {isEditing ? (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-medium text-emerald-400 mb-2 uppercase tracking-wider">
                          How did you feel?
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {EMOTIONS.map((em) => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => setDraftEmotion(em)}
                              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                                draftEmotion === em
                                  ? emotionStyles[em] + " ring-1 ring-offset-0"
                                  : "bg-slate-800/60 text-slate-400 border-slate-700"
                              }`}
                            >
                              {emotionEmoji[em]} {em}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                          Journal notes
                        </p>
                        <textarea
                          value={draftNotes}
                          onChange={(e) => setDraftNotes(e.target.value)}
                          rows={5}
                          placeholder="What was the setup? What did you do well? What will you improve next time?"
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none leading-relaxed"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => saveJournal(entry._id)}
                          disabled={saving}
                          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                        >
                          {saving ? "Saving..." : "Save journal"}
                        </button>
                        <button
                          type="button"
                          onClick={closeEditor}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hasNotes ? (
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {entry.notes}
                        </p>
                      ) : (
                        <p className="text-slate-500 text-sm italic">
                          No journal notes yet for this trade.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditor(entry)}
                        className={`text-sm font-medium transition ${
                          hasNotes
                            ? "text-slate-400 hover:text-white"
                            : "text-emerald-400 hover:text-emerald-300"
                        }`}
                      >
                        {hasNotes ? "Edit journal notes →" : "+ Add journal notes"}
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-lg font-semibold ${color}`}>{value}</p>
    </div>
  );
}