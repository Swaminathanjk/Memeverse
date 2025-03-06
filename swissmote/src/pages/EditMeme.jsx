import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
          `https://memeverse-kihy.vercel.app/api/memes/${memeId}`
        );
        setMeme(response.data);
        setNewCaption(response.data.caption);
      } catch (error) {
        console.error(
          "Error fetching meme:",
          error.response?.data || error.message
        );
      }
    };

    fetchMeme();
  }, [memeId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file)); // Show preview before uploading
    }
  };

  const handleUpdateMeme = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("caption", newCaption);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://memeverse-kihy.vercel.app/api/memes/${memeId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Meme updated!");
      navigate("/profile");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update meme.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Delete Meme Function
  const handleDeleteMeme = async () => {
    if (!window.confirm("Are you sure you want to delete this meme?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://memeverse-kihy.vercel.app/api/memes/${memeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Meme deleted!");
      navigate("/profile"); // Redirect to profile after deleting
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete meme.");
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

          {/* ✅ Delete Meme Button */}
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
