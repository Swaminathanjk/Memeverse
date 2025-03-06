const express = require("express");
const User = require("../models/User");
const Meme = require("../models/Meme"); // ✅ Import Meme Model
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const mongoose = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

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

// ✅ Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});
const upload = multer({ storage });

// ✅ Combined Route: Update Bio & Profile Picture
router.put(
  "/:id/update-profile",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res.status(403).json("You can only update your own profile.");
      }

      const updateFields = {};
      if (req.body.bio) updateFields.bio = req.body.bio;
      if (req.file) updateFields.profilePic = req.file.path; // Cloudinary URL

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json("Failed to update profile.");
    }
  }
);

// ✅ Get User’s Uploaded Memes
router.get("/:id/memes", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.id); // ✅ Convert to ObjectId

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

// ✅ Upload Meme to User-Specific Collection
router.post(
  "/:id/memes",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
    try {
      if (req.user.id !== req.params.id) {
        return res
          .status(403)
          .json("You can only upload memes to your own profile.");
      }

      const newMeme = new Meme({
        imageUrl: req.file.path, // ✅ Cloudinary URL
        caption: req.body.caption,
        owner: req.user.id, // ✅ Link meme to user
      });

      await newMeme.save();
      res
        .status(201)
        .json({ message: "Meme uploaded to profile!", meme: newMeme });
    } catch (error) {
      res.status(500).json("Failed to upload meme.");
    }
  }
);

module.exports = router;
