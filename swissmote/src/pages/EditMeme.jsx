import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import uploadToCloudinary from "../utils/uploadToCloudinary";
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
          `http://localhost:5000/api/memes/${memeId}`
        );
        setMeme(response.data);
        setNewCaption(response.data.caption);
      } catch (error) {
        console.error("Error fetching meme:", error);
      }
    };

    fetchMeme();
  }, [memeId]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateMeme = async () => {
    setUploading(true);
    let imageUrl = meme.imageUrl;

    if (newImage) {
      imageUrl = await uploadToCloudinary(newImage);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/memes/${memeId}`,
        { caption: newCaption, imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditMeme;
