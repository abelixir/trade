import { useState, useEffect, useRef } from "react";

export default function WeeklyAnalysis() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [expectations, setExpectations] = useState("");
  const [images, setImages] = useState([]); // { id, url, name }
  const fileInputRef = useRef(null);

  // Load saved entries
  useEffect(() => {
    const saved = localStorage.getItem("weeklyAnalyses");
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // Save whenever entries change
  useEffect(() => {
    localStorage.setItem("weeklyAnalyses", JSON.stringify(entries));
  }, [entries]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // reset input so same file can be selected again
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !weekStart || !weekEnd) {
      alert("Please fill title and week dates");
      return;
    }

    const newEntry = {
      id: Date.now(),
      title: title.trim(),
      weekStart,
      weekEnd,
      notes: notes.trim(),
      expectations: expectations.trim(),
      images,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [newEntry, ...prev]);

    // Reset form
    setTitle("");
    setWeekStart("");
    setWeekEnd("");
    setNotes("");
    setExpectations("");
    setImages([]);
    setShowForm(false);
  };

  const deleteEntry = (id) => {
    if (window.confirm("Delete this weekly analysis?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly Analysis</h2>
          <p className="text-slate-400 mt-1">
            Chart analysis, notes & expectations for the week
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
        >
          {showForm ? "Cancel" : "+ New Weekly Analysis"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 md:p-8 mb-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-1">
              <label className="block text-sm text-slate-400 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Week of Oct 27 – EURUSD bias"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Week Start</label>
              <input
                type="date"
                value={weekStart}
                onChange={(e) => setWeekStart(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Week End</label>
              <input
                type="date"
                value={weekEnd}
                onChange={(e) => setWeekEnd(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Charts / Screenshots
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer transition bg-slate-800/40"
            >
              <div className="text-3xl mb-2">📷</div>
              <p className="text-slate-300 font-medium">Click to upload images</p>
              <p className="text-slate-500 text-sm mt-1">
                PNG, JPG, WEBP — multiple files allowed
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {images.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-36 object-cover rounded-xl border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="absolute top-2 right-2 bg-rose-500 hover:bg-rose-400 text-white w-7 h-7 rounded-full text-sm opacity-0 group-hover:opacity-100 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Analysis Notes
            </label>
            <textarea
              rows="5"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you see on the charts? Key levels, structure, bias..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          {/* Expectations */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Expectations / Plan for the week
            </label>
            <textarea
              rows="4"
              value={expectations}
              onChange={(e) => setExpectations(e.target.value)}
              placeholder="What are you looking for this week? Scenarios, invalidation levels..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-7 py-3 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
            >
              Save Weekly Analysis
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-7 py-3 rounded-xl font-medium transition"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Previous Entries */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-5">
          Previous Weekly Analyses
        </h3>

        {entries.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
            <p className="text-slate-400">No weekly analyses yet.</p>
            <p className="text-slate-500 text-sm mt-2">
              Create your first one using the button above.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 md:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {entry.title}
                    </h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(entry.weekStart).toLocaleDateString()} →{" "}
                      {new Date(entry.weekEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-sm text-rose-400 hover:text-rose-300 transition self-start sm:self-auto"
                  >
                    Delete
                  </button>
                </div>

                {/* Images */}
                {entry.images?.length > 0 && (
                  <div className="p-5 md:p-6 border-b border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {entry.images.map((img) => (
                        <a
                          key={img.id}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-48 object-cover rounded-xl border border-slate-700 group-hover:border-emerald-500/40 transition"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes & Expectations */}
                <div className="p-5 md:p-6 space-y-5">
                  {entry.notes && (
                    <div>
                      <h5 className="text-sm font-medium text-emerald-400 mb-2">
                        Analysis Notes
                      </h5>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {entry.notes}
                      </p>
                    </div>
                  )}

                  {entry.expectations && (
                    <div>
                      <h5 className="text-sm font-medium text-cyan-400 mb-2">
                        Expectations / Plan
                      </h5>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {entry.expectations}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 pt-2">
                    Created {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}