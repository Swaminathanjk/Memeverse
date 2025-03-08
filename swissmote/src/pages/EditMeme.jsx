import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { toast } from "sonner"; // ✅ Import Sonner for toasts
import "../styles/editMeme.css";

const EditMeme = () => {
  const { memeId } = useParams();
  const navigate = useNavigate();
  const [meme, setMeme] = useState(null);
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const response = await axios.get(
          `https://memeverse-backend.vercel.app/api/memes/${memeId}`
        );
        setMeme(response.data);
        setNewCaption(response.data.caption);
      } catch (error) {
        console.error("Error fetching meme:", error);
        toast.error("Failed to load meme ❌");
      }
    };

    fetchMeme();
  }, [memeId]);

  // ✅ Handle Image Change (Preview)
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Update Meme
  const handleUpdateMeme = async () => {
    if (!newCaption.trim()) {
      toast.warning("Please add a caption! ✏️");
      return;
    }

    setUploading(true);
    let imageUrl = meme.imageUrl;

    if (newImage) {
      imageUrl = await uploadToCloudinary(newImage);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://memeverse-backend.vercel.app/api/memes/${memeId}`,
        { caption: newCaption, imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Meme updated successfully! ✅");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update meme ❌");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete Meme (No Confirmation, Just Toast)
  const handleDeleteMeme = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://memeverse-backend.vercel.app/api/memes/${memeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Meme deleted successfully! ✅");
      navigate("/profile"); // Redirect back after deletion
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete meme ❌");
    }
  };

  return (
    <div className="edit-meme-container">
      {meme ? (
        <>
          <h1>Edit Meme</h1>
          <img
            src={preview || meme.imageUrl}
            alt="Meme"
            className="edit-meme-img"
          />
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <input
            type="text"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
          />
          <button onClick={handleUpdateMeme} disabled={uploading}>
            {uploading ? "Updating..." : "Save Changes"}
          </button>

          {/* ✅ Delete Meme Button (No Confirmation) */}
          <button className="delete-btn" onClick={handleDeleteMeme}>
            Delete Meme
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditMeme;
