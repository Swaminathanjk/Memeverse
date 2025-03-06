const mongoose = require("mongoose");

const MemeSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    likes: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Optional owner
  },
  { timestamps: true }
);

// Middleware to set "MemeVerse" as the owner if none is provided
MemeSchema.pre("save", function (next) {
  if (!this.owner) {
    this.owner = null; // Handled in frontend as "MemeVerse"
  }
  next();
});

module.exports = mongoose.model("Meme", MemeSchema);
