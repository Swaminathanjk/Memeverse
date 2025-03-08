import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import { toast } from "sonner"; // ✅ Import Sonner for notifications
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [memes, setMemes] = useState([]);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("/default-avatar.jpg");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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
      setProfilePic(parsedUser.profilePic || "/default-avatar.jpg");

      axios
        .get(
          `https://memeverse-backend.vercel.app/api/users/${parsedUser._id}/memes`
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

  // ✅ Combined Profile Update Function (Bio & Picture)
  const handleProfileUpdate = async (event) => {
    if (!user) return;

    setUpdating(true);
    let imageUrl = profilePic;

    // ✅ If a new image is selected, upload to Cloudinary
    if (event.target.files?.[0]) {
      const uploadedUrl = await uploadToCloudinary(event.target.files[0]);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication Error ❌", {
          description: "You're not logged in. Please log in again.",
        });
        return;
      }

      const response = await axios.put(
        `https://memeverse-backend.vercel.app/api/users/${user._id}/update-profile`,
        { bio, profilePic: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      setProfilePic(updatedUser.profilePic);
      setBio(updatedUser.bio);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile Updated ✅", {
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      console.error("Profile update failed:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong while updating your profile.";

      toast.error("Update Failed ❌", {
        description: errorMessage,
      });

      if (error.response?.status === 403) {
        toast.error("Session Expired", {
          description: "Please log in again.",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // ✅ Redirect to login
      }
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Remove Profile Picture (Reset to Default)
  const handleRemoveProfilePic = async () => {
    if (!user) return;

    setUpdating(true);
    const defaultPic = "/default-avatar.jpg"; // ✅ Default avatar

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Authentication Error ❌", {
          description: "You're not logged in. Please log in again.",
        });
        return;
      }

      const response = await axios.put(
        `https://memeverse-backend.vercel.app/api/users/${user._id}/update-profile`,
        { bio, profilePic: defaultPic },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      setProfilePic(defaultPic);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile Picture Removed ✅", {
        description: "Your profile picture has been reset to default.",
      });
    } catch (error) {
      console.error("Failed to remove profile picture:", error);
      toast.error("Error ❌", {
        description: "Failed to remove profile picture.",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <h1>{user.username}'s Profile</h1>

          {/* ✅ Profile Picture Edit (Click to Upload) */}
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

          {/* ✅ Remove Profile Picture Button */}
          {profilePic !== "/default-avatar.jpg" && (
            <button
              className="remove-pic-btn"
              onClick={handleRemoveProfilePic}
              disabled={updating}
            >
              {updating ? "Removing..." : "Remove Profile Picture"}
            </button>
          )}

          {/* ✅ Bio Update */}
          <input
            type="text"
            placeholder="Update your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button onClick={handleProfileUpdate} disabled={updating}>
            {updating ? "Updating..." : "Update Profile"}
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
