import { useState, useEffect, useRef } from "react";
import {
  getCertificates,
  createCertificate,
  deleteCertificate,
} from "../services/api";

const emptyForm = {
  title: "",
  type: "Certificate",
  notes: "",
  image: null,
};

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const fileInputRef = useRef(null);

  const fetchCerts = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCertificates();
      setCerts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image");
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      alert("Image too large. Keep under 1.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.image) {
      alert("Title and image are required");
      return;
    }

    setSaving(true);
    try {
      const created = await createCertificate({
        title: form.title.trim(),
        type: form.type || "Certificate",
        notes: form.notes.trim(),
        image: form.image,
      });
      setCerts((prev) => [created, ...prev]);
      closeForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      await deleteCertificate(id);
      setCerts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

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
          <h2 className="text-2xl font-bold text-white">Certificates</h2>
          <p className="text-slate-400 mt-1">
            Store your trading achievements and course certificates
          </p>
        </div>
        <button
          type="button"
          onClick={showForm ? closeForm : openCreate}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition"
        >
          {showForm ? "Cancel" : "+ Add Certificate"}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-4 py-3 text-sm space-y-2">
          <p>{error}</p>
          <button
            type="button"
            onClick={fetchCerts}
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
          <h3 className="text-lg font-semibold text-white">New certificate</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. ICT Mentorship Certificate"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Certificate">Certificate</option>
                <option value="Course">Course</option>
                <option value="Achievement">Achievement</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Image (required, under 1.5MB)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center cursor-pointer bg-slate-800/40 transition"
            >
              {form.image ? (
                <img
                  src={form.image}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded-xl border border-slate-700"
                />
              ) : (
                <p className="text-slate-300 text-sm">Click to upload certificate image</p>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes (optional)</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any extra details..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-6 py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "Save Certificate"}
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

      {certs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-white mb-2">No certificates yet</h3>
          <p className="text-slate-400 mb-6">
            Upload your first certificate or achievement.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
          >
            + Add Certificate
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition group"
            >
              <div className="aspect-[4/3] bg-slate-800 relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(cert._id)}
                  className="absolute top-3 right-3 bg-rose-500/90 hover:bg-rose-500 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  Delete
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white">{cert.title}</h4>
                    <p className="text-xs text-emerald-400/80 mt-0.5">{cert.type}</p>
                  </div>
                </div>
                {cert.notes && (
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2">{cert.notes}</p>
                )}
                <p className="text-xs text-slate-500 mt-3">
                  {new Date(cert.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}