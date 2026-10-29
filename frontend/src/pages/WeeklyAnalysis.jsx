import { useState, useEffect, useRef } from "react";

const API = "http://localhost:5000/api/weekly-analysis";

const emptyForm = {
  title: "",
  weekStart: "",
  weekEnd: "",
  notes: "",
  expectations: "",
  images: [],
};

export default function WeeklyAnalysis() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  const fetchEntries = async () => {
    console.log("[WeeklyAnalysis] fetch start");
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("Not logged in. Please log in again.");
        return;
      }

      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("[WeeklyAnalysis] status", res.status);

      if (res.status === 401) {
        setError("Session expired. Log out and log in again.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Failed to load (${res.status})`);
      }

      const data = await res.json();
      console.log("[WeeklyAnalysis] entries", data);
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[WeeklyAnalysis] error", err);
      setError(
        err.message ||
          "Could not load weekly analyses. Is the backend running?"
      );
    } finally {
      // THIS is what stops "Loading..." forever
      setLoading(false);
      console.log("[WeeklyAnalysis] fetch done");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (entry) => {
    setEditingId(entry._id);
    setForm({
      title: entry.title || "",
      weekStart: entry.weekStart
        ? new Date(entry.weekStart).toISOString().split("T")[0]
        : "",
      weekEnd: entry.weekEnd
        ? new Date(entry.weekEnd).toISOString().split("T")[0]
        : "",
      notes: entry.notes || "",
      expectations: entry.expectations || "",
      images: (entry.images || []).map((img) => ({
        name: img.name || "",
        url: img.url,
      })),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      // Keep small for free MongoDB
      if (file.size > 1.5 * 1024 * 1024) {
        alert(`${file.name} is too large. Use under 1.5MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { name: file.name, url: event.target.result },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.weekStart || !form.weekEnd) {
      alert("Please fill title and week dates");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        title: form.title.trim(),
        weekStart: form.weekStart,
        weekEnd: form.weekEnd,
        notes: form.notes.trim(),
        expectations: form.expectations.trim(),
        images: form.images,
      };

      const isEdit = Boolean(editingId);
      const res = await fetch(isEdit ? `${API}/${editingId}` : API, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to save");

      if (isEdit) {
        setEntries((prev) =>
          prev.map((e) => (e._id === editingId ? data : e))
        );
      } else {
        setEntries((prev) => [data, ...prev]);
      }
      closeForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this weekly analysis?")) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setEntries((prev) => prev.filter((e) => e._id !== id));
      if (editingId === id) closeForm();
    } catch (err) {
      alert(err.message);
    }
  };

  // ---- UI ----
  if (loading) {
    return (
      <div className="text-slate-400">
        <p>Loading weekly analyses...</p>
        <p className="text-xs text-slate-500 mt-2">
          Check the browser console for [WeeklyAnalysis] logs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Weekly Analysis</h2>
          <p className="text-slate-400 mt-1">
            Charts, bias, and plan for the week ahead
          </p>
        </div>
        <button
          type="button"
          onClick={showForm && !editingId ? closeForm : openCreate}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition"
        >
          {showForm && !editingId ? "Cancel" : "+ New Weekly Analysis"}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm space-y-2">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchEntries}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-10 space-y-6"
        >
          <h3 className="text-lg font-semibold text-white">
            {editingId ? "Edit weekly analysis" : "New weekly analysis"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Week start
              </label>
              <input
                type="date"
                value={form.weekStart}
                onChange={(e) => handleChange("weekStart", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Week end
              </label>
              <input
                type="date"
                value={form.weekEnd}
                onChange={(e) => handleChange("weekEnd", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Charts (optional, keep small — under 1.5MB)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-800/40"
            >
              <p className="text-slate-300 text-sm">Click to upload images</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-28 object-cover rounded-xl border border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-rose-500 text-white w-6 h-6 rounded-full text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes</label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Expectations
            </label>
            <textarea
              rows={3}
              value={form.expectations}
              onChange={(e) => handleChange("expectations", e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-slate-800 text-slate-300 px-6 py-3 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3 className="text-lg font-semibold text-white mb-5">Previous entries</h3>

      {entries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No weekly analyses yet.
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => (
            <div
              key={entry._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-white">{entry.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    {new Date(entry.weekStart).toLocaleDateString()} →{" "}
                    {new Date(entry.weekEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(entry)}
                    className="text-sm text-emerald-400"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEntry(entry._id)}
                    className="text-sm text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {entry.images?.length > 0 && (
                <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3 border-b border-slate-800">
                  {entry.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className="w-full h-40 object-cover rounded-xl border border-slate-700"
                    />
                  ))}
                </div>
              )}

              <div className="p-5 space-y-3 text-slate-300 text-sm">
                {entry.notes && (
                  <p className="whitespace-pre-wrap">{entry.notes}</p>
                )}
                {entry.expectations && (
                  <p className="text-cyan-300/90 whitespace-pre-wrap">
                    {entry.expectations}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}