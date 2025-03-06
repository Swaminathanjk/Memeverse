import React, { useState } from "react";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadToCloudinary"; // ✅ Import the function
import "../styles/upload.css";

const Upload = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);

    try {
      const cloudinaryUrl = await uploadToCloudinary(image); // ✅ Upload to Cloudinary
      if (!cloudinaryUrl) throw new Error("Image upload failed");

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        `https://memeverse-kihy.vercel.app/api/users/${user._id}/memes`,
        { imageUrl: cloudinaryUrl, caption }, // ✅ Send only URL to backend
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Meme uploaded successfully!");
      setImage(null);
      setPreview(null);
      setCaption("");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload meme.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Meme</h2>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && (
        <img src={preview} alt="Meme Preview" className="meme-preview" />
      )}
      <input
        type="text"
        placeholder="Add a funny caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Meme"}
      </button>
    </div>
  );
};

export default Upload;
