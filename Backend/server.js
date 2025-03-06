const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config(); // ✅ Load env variables

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: ["https://memeverse-swaminathanjks-projects.vercel.app"], // ✅ Allow frontend
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection with Error Handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // ✅ Exit if MongoDB fails
  });

// ✅ Root Route to Keep Vercel Server Alive
app.get("/", (req, res) => {
  res.send("✅ MemeVerse Backend is Running!");
});

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/memes", require("./routes/meme"));
app.use("/api/users", require("./routes/user"));

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route Not Found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
