import React, { useEffect, useState } from "react";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadToCloudinary"; // ✅ Import Cloudinary function
import "../styles/upload.css";

const Upload = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch user and set loading state
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Set user info from localStorage
      }
    }
    setLoading(false); // Stop loading once token is checked and user is set
  }, []);

  // Handle image change (preview)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // Display preview of the selected image
    }
  };

  // Handle meme upload
  const handleUpload = async () => {
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setUploading(true);

    try {
      // Upload image to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(image);
      if (!cloudinaryUrl) {
        throw new Error("Image upload failed");
      }

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      // Send the image URL and caption to the backend
      const response = await axios.post(
        `http://localhost:5000/api/users/${user._id}/memes`,
        { imageUrl: cloudinaryUrl, caption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Meme uploaded successfully!");

      // Reset state after upload
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
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
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
        </>
      ) : (
        <>
          <h2>Upload Your Meme</h2>
          <p>Please log in to upload memes.</p>
        </>
      )}
    </div>
  );
};

export default Upload;
