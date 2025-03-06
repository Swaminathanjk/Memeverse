import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://memeverse-kihy.vercel.app/api/auth/register",
        {
          username,
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Registration Successful!");
      navigate("/profile");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <img src="/meme.jpg" alt="logo" className="logo-register" />

      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className={`input-field ${error ? "input-error" : ""}`}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error-message">{error}</p>}

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
