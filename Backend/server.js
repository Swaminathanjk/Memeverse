const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // ✅ Load env variables

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.set("strictQuery", false); // ✅ Prevents deprecation warnings
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Debugging: Log if the server starts correctly
console.log("✅ Server Starting...");

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/memes", require("./routes/meme"));
app.use("/api/users", require("./routes/user"));

// ✅ Error Handling (for better debugging)
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// ✅ Fix Vercel Timeout by Keeping Server Alive
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
