import React, { useState } from "react";
import axios from "axios";
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
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user")); // ✅ Get user ID

      // ✅ Upload to User-Specific Meme Collection
      const response = await axios.post(
        `https://memeverse-kihy.vercel.app/api/users/${user._id}/memes`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
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
