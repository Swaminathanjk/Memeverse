const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // ✅ Load environment variables

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: ["https://your-frontend.vercel.app"], // ✅ Allow frontend requests
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection with Error Handling
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // ✅ Exit process on failure
  });

// ✅ Debugging: Log when the server starts
console.log("✅ Server Starting...");

// ✅ Root Route to Keep Vercel Server Alive
app.get("/", (req, res) => {
  res.send("✅ MemeVerse Backend is Running!");
});

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/memes", require("./routes/meme"));
app.use("/api/users", require("./routes/user"));

// ✅ Global Error Handling (404)
app.use((req, res, next) => {
  res.status(404).json({ error: "Route Not Found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
