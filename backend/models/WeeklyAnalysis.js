const express = require("express");
const WeeklyAnalysis = require("../models/WeeklyAnalysis");
const { protect } = require("../middleware/auth");

const router = express.Router();

// LIST — no image urls (fast)
router.get("/", protect, async (req, res) => {
  try {
    const entries = await WeeklyAnalysis.find({ user: req.user._id })
      .select("-images.url") // exclude heavy base64
      .sort({ createdAt: -1 })
      .lean();

    // still show how many images each has
    const shaped = entries.map((e) => ({
      ...e,
      imageCount: Array.isArray(e.images) ? e.images.length : 0,
      images: undefined,
    }));

    res.json(shaped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DETAIL — full entry including images (only when opened)
router.get("/:id", protect, async (req, res) => {
  try {
    const entry = await WeeklyAnalysis.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", protect, async (req, res) => {
  try {
    const { title, weekStart, weekEnd, notes, expectations, images } = req.body;

    if (!title || !weekStart || !weekEnd) {
      return res.status(400).json({ message: "Title and week dates are required" });
    }

    // limit images to keep DB usable on free tier
    const safeImages = Array.isArray(images) ? images.slice(0, 4) : [];

    const entry = await WeeklyAnalysis.create({
      user: req.user._id,
      title: title.trim(),
      weekStart,
      weekEnd,
      notes: notes || "",
      expectations: expectations || "",
      images: safeImages,
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  try {
    const entry = await WeeklyAnalysis.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, weekStart, weekEnd, notes, expectations, images } = req.body;

    if (title !== undefined) entry.title = title.trim();
    if (weekStart !== undefined) entry.weekStart = weekStart;
    if (weekEnd !== undefined) entry.weekEnd = weekEnd;
    if (notes !== undefined) entry.notes = notes;
    if (expectations !== undefined) entry.expectations = expectations;
    if (images !== undefined) {
      entry.images = Array.isArray(images) ? images.slice(0, 4) : [];
    }

    const updated = await entry.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const entry = await WeeklyAnalysis.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Not found" });
    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await entry.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;