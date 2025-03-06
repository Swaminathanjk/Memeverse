const express = require("express");
const User = require("../models/User");
const Meme = require("../models/Meme");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

// ✅ Update Profile (Bio & Profile Picture)
router.put("/:id/update-profile", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json("You can only update your own profile.");
    }

    const updateFields = {};
    if (req.body.bio) updateFields.bio = req.body.bio;
    if (req.body.profilePic) updateFields.profilePic = req.body.profilePic; // ✅ Store only Cloudinary URL

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json("Failed to update profile.");
  }
});

// ✅ Get User’s Uploaded Memes
router.get("/:id/memes", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id);
    const memes = await Meme.find({ owner: userId });

    if (memes.length === 0) {
      return res.status(404).json("No memes found for this user.");
    }

    res.json(memes);
  } catch (error) {
    console.error("Error fetching memes:", error);
    res.status(500).json("Error fetching memes.");
  }
});

// ✅ Upload Meme to User's Profile (Now Accepts Only URL)
router.post("/:id/memes", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json("You can only upload memes to your own profile.");
    }

    const { imageUrl, caption } = req.body;
    if (!imageUrl || !caption) {
      return res
        .status(400)
        .json({ error: "Image URL and caption are required" });
    }

    const newMeme = new Meme({
      imageUrl,
      caption,
      owner: req.user.id,
    });

    await newMeme.save();
    res
      .status(201)
      .json({ message: "Meme uploaded to profile!", meme: newMeme });
  } catch (error) {
    res.status(500).json("Failed to upload meme.");
  }
});

module.exports = router;
