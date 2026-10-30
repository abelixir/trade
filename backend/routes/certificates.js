const express = require("express");
const Certificate = require("../models/Certificate");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET all certificates of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", protect, async (req, res) => {
  try {
    const { title, type, image, notes } = req.body;

    if (!title || !image) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const cert = await Certificate.create({
      user: req.user._id,
      title: title.trim(),
      type: type || "Certificate",
      image,
      notes: notes || "",
    });

    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Not found" });

    if (cert.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await cert.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;