require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const tradesRoutes = require("./routes/trades");

connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/trades", tradesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});