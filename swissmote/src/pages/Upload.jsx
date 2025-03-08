import React, { useEffect, useState } from "react";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { toast } from "sonner"; // ✅ Import Sonner toast
import "../styles/upload.css";

const Upload = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("No Image Selected ❌", {
        description: "Please select an image before uploading.",
      });
      return;
    }

    if (!caption.trim()) {
      toast.info("Add a Caption 📝", {
        description: "Your meme needs a caption before uploading!",
      });
      return;
    }

    setUploading(true);

    try {
      const cloudinaryUrl = await uploadToCloudinary(image);
      if (!cloudinaryUrl) {
        throw new Error("Image upload failed");
      }

      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(
        `https://memeverse-backend.vercel.app/api/users/${user._id}/memes`,
        { imageUrl: cloudinaryUrl, caption },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Success Toast Notification
      toast.success("Meme Uploaded ✅", {
        description: "Your meme has been successfully uploaded!",
      });

      setImage(null);
      setPreview(null);
      setCaption("");
    } catch (error) {
      console.error("Upload failed:", error);

      // ❌ Error Toast Notification
      toast.error("Upload Failed ❌", {
        description: "Failed to upload meme. Please try again.",
      });
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
