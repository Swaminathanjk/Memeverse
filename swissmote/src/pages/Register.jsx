import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ Import Sonner toast
import "../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      toast.error("Missing Fields ❌", {
        description: "All fields are required.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://memeverse-backend.vercel.app/api/auth/register",
        { username, email, password }
      );

      // ✅ Success Toast Notification
      toast.success("Registration Successful ✅", {
        description: "You can now log in to MemeVerse.",
      });

      setTimeout(() => {
        navigate("/login"); // ✅ Redirect to login page after success
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);

      let errorMessage = "Something went wrong.";
      if (err.response?.data?.error) errorMessage = err.response.data.error;

      // ❌ Error Toast Notification
      toast.error("Registration Failed ❌", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <img src="/meme.jpg" alt="logo" className="logo-register" />

      <input
        className="input-field"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="input-field"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="input-field"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="register-btn"
        onClick={handleRegister}
        disabled={loading}
      >
        {loading ? "Registering..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Register;
