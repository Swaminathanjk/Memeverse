const express = require("express");
const Meme = require("../models/Meme");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const router = express.Router();

// ✅ Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json("Access Denied");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid Token");
    req.user = user;
    next();
  });
};

// ✅ Fetch All Memes (Populating owner field)
router.get("/", async (req, res) => {
  try {
    // Populating owner with the username
    const memes = await Meme.find()
      .populate("owner", "username")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch memes" });
  }
});

// ✅ Fetch Meme by ID (Populating owner field)
router.get("/:id", async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id).populate(
      "owner",
      "username"
    );
    if (!meme) {
      return res.status(404).json({ error: "Meme not found" });
    }
    res.json(meme);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meme" });
  }
});

// ✅ Upload Meme (Accepts Image URLs, populates owner field)
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { imageUrl, caption } = req.body;
    if (!imageUrl || !caption) {
      return res
        .status(400)
        .json({ error: "Image URL and caption are required" });
    }

    const newMeme = new Meme({
      imageUrl,
      caption,
      owner: req.user.id || null, // If no owner, set as null for premade memes
    });

    await newMeme.save();
    // Populate the owner field after saving the meme
    await newMeme.populate("owner", "username");
    res
      .status(201)
      .json({ message: "Meme uploaded successfully!", meme: newMeme });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload meme" });
  }
});

// ✅ Update Meme (Accepts Image URLs, populates owner field)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });

    if (meme.owner.toString() !== req.user.id)
      return res.status(403).json("Unauthorized");

    if (caption) meme.caption = caption;
    if (imageUrl) meme.imageUrl = imageUrl;

    await meme.save();
    // Populate the owner field after updating
    await meme.populate("owner", "username");
    res.json({ message: "Meme updated!", meme });
  } catch (error) {
    res.status(500).json({ error: "Failed to update meme" });
  }
});

// ✅ Delete Meme (Populates owner field for checking)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const meme = await Meme.findById(req.params.id);
    if (!meme) return res.status(404).json({ error: "Meme not found" });

    if (meme.owner.toString() !== req.user.id)
      return res.status(403).json("Unauthorized");

    await meme.deleteOne();
    res.json({ message: "Meme deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete meme" });
  }
});

module.exports = router;
