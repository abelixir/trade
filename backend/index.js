require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const tradesRoutes = require("./routes/trades");
// weeklyAnalysis removed for now — add later when ready

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradesRoutes);
// app.use("/api/weekly-analysis", weeklyAnalysisRoutes);  // later

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});