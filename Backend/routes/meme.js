const express = require("express");
const Meme = require("../models/Meme");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "memeverse",
    allowed_formats: ["jpg", "png", "gif"],
  },
});

const upload = multer({ storage });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid Token");
    req.user = user;
    next();
  });
};

router.get("/", async (req, res) => {
  try {
    const memes = await Meme.find().limit(50);
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch memes" });
  }
});

// ✅ Fetch Meme by Meme ID
router.get("/:id", async (req, res) => {
  try {
    const memeId = new mongoose.Types.ObjectId(req.params.id); // ✅ Convert to ObjectId
    const meme = await Meme.findById(memeId);

    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }

    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meme" });
  }
});
// ✅ Update Meme (Caption & Image)
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid meme ID format" });
    }

    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });

    if (meme.owner.toString() !== req.user.id) {
      return res.status(403).json("Unauthorized");
    }

    // ✅ Update caption if provided
    if (req.body.caption) {
      meme.caption = req.body.caption;
    }

    // ✅ Update image if a new one is uploaded
    if (req.file) {
      meme.imageUrl = req.file.path; // Cloudinary URL
    }

    await meme.save();
    res.json({ message: "Meme updated!", meme });
  } catch (error) {
    console.error("Error updating meme:", error);
    res.status(500).json({ error: "Failed to update meme" });
  }
});

// Upload Meme Route
router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      const newMeme = new Meme({
        imageUrl: req.file.path, // ✅ Save Cloudinary URL
        caption: req.body.caption,
        owner: req.user.id || null, // ✅ If no owner, set as null (for premade memes)
      });

      await newMeme.save();
      res
        .status(201)
        .json({ message: "Meme uploaded successfully!", meme: newMeme });
    } catch (error) {
      res.status(500).json("Upload failed");
    }
  }
);
// ✅ Update Meme Caption
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json("Meme not found");
    if (meme.owner.toString() !== req.user.id)
      return res.status(403).json("Unauthorized");

    meme.caption = req.body.caption;
    await meme.save();
    res.json({ message: "Meme updated!", meme });
  } catch (error) {
    res.status(500).json("Error updating meme");
  }
});

// ✅ Delete Meme
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json("Meme not found");
    if (meme.owner.toString() !== req.user.id)
      return res.status(403).json("Unauthorized");

    await meme.deleteOne();
    res.json({ message: "Meme deleted!" });
  } catch (error) {
    res.status(500).json("Error deleting meme");
  }
});

module.exports = router;
