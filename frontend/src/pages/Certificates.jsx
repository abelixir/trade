import { useState, useEffect, useRef } from "react";

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Certificate");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/certificates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchCertificates();
  }, [token]);

  // Compress image
  const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
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
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch (err) {
      alert("Failed to process image");
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !image) {
      alert("Title and image are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/certificates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          type,
          image,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      await fetchCertificates();
      setTitle("");
      setType("Certificate");
      setNotes("");
      setImage(null);
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCertificate = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/certificates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete");
      setCertificates((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Certificates & Payouts</h2>
          <p className="text-slate-400 mt-1">
            Upload your trading certificates and payout screenshots
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-500/20"
        >
          {showForm ? "Cancel" : "+ Upload New"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-10 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. FTMO Challenge Passed"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Certificate">Certificate</option>
                <option value="Payout">Payout Screenshot</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Image</label>
            <div
              onClick={() => !compressing && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition bg-slate-800/40
                ${compressing ? "border-emerald-500/50" : "border-slate-700 hover:border-emerald-500/50"}`}
            >
              {image ? (
                <img src={image} alt="Preview" className="max-h-48 mx-auto rounded-xl" />
              ) : (
                <>
                  <div className="text-3xl mb-2">{compressing ? "⏳" : "📷"}</div>
                  <p className="text-slate-300 font-medium">
                    {compressing ? "Compressing..." : "Click to upload image"}
                  </p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={compressing}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Notes (optional)</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || compressing || !image}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-7 py-3 rounded-xl font-semibold transition"
            >
              {saving ? "Saving..." : "Save"}
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

      {/* Gallery */}
      {certificates.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <p className="text-slate-400">No certificates or payouts yet.</p>
          <p className="text-slate-500 text-sm mt-2">Upload your first one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      cert.type === "Payout"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {cert.type}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-white mb-1">{cert.title}</h3>
                {cert.notes && (
                  <p className="text-sm text-slate-400 mb-3 line-clamp-2">{cert.notes}</p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {new Date(cert.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => deleteCertificate(cert._id)}
                    className="text-xs text-rose-400 hover:text-rose-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}