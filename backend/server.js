require("dotenv").config({ path: "./backend.env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 5050;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/v1", require("./routes/transactionRoutes"));
app.use("/api/v1/budgets", require("./routes/budgetRoutes"));
app.use("/api/v1/ai", require("./routes/aiRoutes"));

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});