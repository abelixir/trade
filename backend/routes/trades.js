const express = require("express");
const Trade = require("../models/Trade");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET all trades of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new trade
router.post("/", protect, async (req, res) => {
  try {
    const { symbol, direction, entryPrice, exitPrice, positionSize, date, notes, emotion } = req.body;

    // Calculate PnL
    let pnl = 0;
    if (direction === "Long") {
      pnl = (exitPrice - entryPrice) * positionSize;
    } else {
      pnl = (entryPrice - exitPrice) * positionSize;
    }

    const trade = await Trade.create({
      user: req.user._id,
      symbol,
      direction,
      entryPrice,
      exitPrice,
      positionSize,
      pnl: Number(pnl.toFixed(2)),
      date,
      notes,
      emotion,
    });

    res.status(201).json(trade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE trade
router.delete("/:id", protect, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });
    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    await trade.deleteOne();
    res.json({ message: "Trade deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;