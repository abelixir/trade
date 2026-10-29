const express = require("express");
const Trade = require("../models/Trade");
const { protect } = require("../middleware/auth");

const router = express.Router();

// GET all trades for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE trade
router.post("/", protect, async (req, res) => {
  try {
    const {
      symbol,
      direction,
      entryPrice,
      exitPrice,
      positionSize,
      date,
      notes,
      emotion,
    } = req.body;

    if (!symbol || !direction || entryPrice == null || exitPrice == null || !positionSize || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const entry = Number(entryPrice);
    const exit = Number(exitPrice);
    const size = Number(positionSize);

    let pnl = 0;
    if (direction === "Long") {
      pnl = (exit - entry) * size;
    } else {
      pnl = (entry - exit) * size;
    }

    const trade = await Trade.create({
      user: req.user._id,
      symbol,
      direction,
      entryPrice: entry,
      exitPrice: exit,
      positionSize: size,
      pnl: Number(pnl.toFixed(2)),
      date,
      notes: notes || "",
      emotion: emotion || "Neutral",
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
// UPDATE trade (notes, emotion, or other fields)
router.put("/:id", protect, async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: "Trade not found" });

    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { notes, emotion, symbol, direction, entryPrice, exitPrice, positionSize, date } = req.body;

    if (notes !== undefined) trade.notes = notes;
    if (emotion !== undefined) trade.emotion = emotion;
    if (symbol !== undefined) trade.symbol = symbol;
    if (direction !== undefined) trade.direction = direction;
    if (entryPrice !== undefined) trade.entryPrice = Number(entryPrice);
    if (exitPrice !== undefined) trade.exitPrice = Number(exitPrice);
    if (positionSize !== undefined) trade.positionSize = Number(positionSize);
    if (date !== undefined) trade.date = date;

    // Recalculate PnL if prices/size/direction changed
    if (
      entryPrice !== undefined ||
      exitPrice !== undefined ||
      positionSize !== undefined ||
      direction !== undefined
    ) {
      const entry = trade.entryPrice;
      const exit = trade.exitPrice;
      const size = trade.positionSize;
      let pnl = 0;
      if (trade.direction === "Long") {
        pnl = (exit - entry) * size;
      } else {
        pnl = (entry - exit) * size;
      }
      trade.pnl = Number(pnl.toFixed(2));
    }

    const updated = await trade.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;