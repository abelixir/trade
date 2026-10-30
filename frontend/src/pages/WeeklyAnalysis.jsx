import { useState, useEffect, useRef } from "react";

export default function WeeklyAnalysis() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [notes, setNotes] = useState("");
  const [expectations, setExpectations] = useState("");
  const [images, setImages] = useState([]);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  // ====================== LOAD FROM BACKEND ======================
  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/weekly-analysis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load");

      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load weekly analyses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token]);

  // ====================== IMAGE COMPRESSION ======================
  const compressImage = (file, maxWidth = 1000, quality = 0.65) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed");
      e.target.value = "";
      return;
    }

    setCompressing(true);

    try {
      const compressedImages = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const compressedUrl = await compressImage(file, 1000, 0.65);

        compressedImages.push({
          url: compressedUrl,
          name: file.name,
        });
      }

      setImages((prev) => [...prev, ...compressedImages]);
    } catch (err) {
      console.error(err);
      alert("Failed to process images");
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ====================== SAVE TO BACKEND ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !weekStart || !weekEnd) {
      alert("Please fill title and week dates");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("http://localhost:5000/api/weekly-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          weekStart,
          weekEnd,
          notes: notes.trim(),
          expectations: expectations.trim(),
          images,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }

      // Refresh list from backend
      await fetchEntries();

      // Reset form
      setTitle("");
      setWeekStart("");
      setWeekEnd("");
      setNotes("");
      setExpectations("");
      setImages([]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save weekly analysis");
    } finally {
      setSaving(false);
    }
  };

  // ====================== DELETE ======================
  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this weekly analysis?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/weekly-analysis/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading weekly analyses...</p>
      </div>
    );
  }

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
              Charts / Screenshots{" "}
              <span className="text-slate-500">(max 4 • auto compressed)</span>
            </label>

            <div
              onClick={() => !compressing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition bg-slate-800/40
                ${compressing ? "border-emerald-500/50 opacity-70" : "border-slate-700 hover:border-emerald-500/50"}`}
            >
              <div className="text-3xl mb-2">{compressing ? "⏳" : "📷"}</div>
              <p className="text-slate-300 font-medium">
                {compressing ? "Compressing images..." : "Click to upload images"}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Images will be resized & compressed automatically
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={compressing}
            />

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={img.name}
                      className="w-full h-36 object-cover rounded-xl border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
            <label className="block text-sm text-slate-400 mb-2">Analysis Notes</label>
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
              disabled={saving || compressing}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-7 py-3 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
            >
              {saving ? "Saving..." : "Save Weekly Analysis"}
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
                key={entry._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
              >
                <div className="p-5 md:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{entry.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(entry.weekStart).toLocaleDateString()} →{" "}
                      {new Date(entry.weekEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry._id)}
                    className="text-sm text-rose-400 hover:text-rose-300 transition self-start sm:self-auto"
                  >
                    Delete
                  </button>
                </div>

                {entry.images?.length > 0 && (
                  <div className="p-5 md:p-6 border-b border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {entry.images.map((img, index) => (
                        <a
                          key={index}
                          href={img.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <img
                            src={img.url}
                            alt={img.name || "chart"}
                            className="w-full h-48 object-cover rounded-xl border border-slate-700 group-hover:border-emerald-500/40 transition"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

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