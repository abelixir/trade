require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const tradesRoutes = require("./routes/trades");
const weeklyAnalysisRoutes = require("./routes/weeklyAnalysis");
const certificatesRoutes = require("./routes/certificates");

connectDB();

const app = express();

app.use(cors());
// higher limit for chart screenshots (base64)
app.use(express.json({ limit: "15mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradesRoutes);
app.use("/api/weekly-analysis", weeklyAnalysisRoutes);
app.use("/api/certificates", certificatesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});