import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import uploadToCloudinary from "../utils/uploadToCloudinary"; // ✅ Import helper function
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setBio(parsedUser.bio || "");
      setProfilePic(parsedUser.profilePic || "/default-avatar.png");

      axios
        .get(
          `https://memeverse-kihy.vercel.app/api/users/${parsedUser._id}/memes`
        )
        .then((response) => setMemes(response.data))
        .catch((error) => console.error("Error fetching memes:", error))
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      setUser(null);
      setLoading(false);
    }
  }, []);

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    if (!user) return;

    setUploading(true);
    let imageUrl = profilePic; // Keep the old profile pic if no new one is uploaded

    if (event.target.files?.[0]) {
      const uploadedUrl = await uploadToCloudinary(event.target.files[0]); // ✅ Upload to Cloudinary
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://memeverse-kihy.vercel.app/api/users/${user._id}/update-profile`,
        { bio, profilePic: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfilePic(response.data.profilePic);
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update profile.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <h1>{user.username}'s Profile</h1>
          <label htmlFor="profile-pic-upload" className="profile-pic-label">
            <img src={profilePic} alt="Profile" className="profile-pic" />
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            accept="image/*"
            onChange={handleProfileUpdate}
            className="hidden-input"
          />

          <input
            type="text"
            placeholder="Update your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button onClick={handleProfileUpdate} disabled={uploading}>
            {uploading ? "Updating..." : "Update Profile"}
          </button>

          <h2>Your Memes</h2>
          {memes.length > 0 ? (
            <div className="meme-grid">
              {memes.map((meme) => (
                <Link
                  key={meme._id}
                  to={`/edit/${meme._id}`}
                  className="meme-card"
                >
                  <img src={meme.imageUrl} alt={meme.caption} />
                  <p>{meme.caption}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>No memes uploaded yet.</p>
          )}
        </>
      ) : (
        <div className="login-message">
          <h2>To view your profile, please log in.</h2>
          <Link to="/login" className="login-link">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
