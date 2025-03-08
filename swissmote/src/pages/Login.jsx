import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // ✅ Import Sonner for notifications
import { Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Missing Credentials ❌", {
        description: "Please enter both email and password.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://memeverse-backend.vercel.app/api/auth/login",
        { email, password }
      );

      // ✅ Store token and user details
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful ", {
        description: `Welcome back, ${response.data.user.username}!`,
      });

      navigate("/profile"); // ✅ Redirect to profile
    } catch (err) {
      console.error("Login failed:", err);

      let errorMessage = "Invalid email or password.";
      if (err.response?.data) errorMessage = err.response.data;

      toast.error("Login Failed ", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <img src="/meme.jpg" alt="logo" className="logo-login" />

      <input
        type="text"
        className="input-mail"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="input-password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link to="/register">New user? Click here to Register</Link>
    </div>
  );
};

export default Login;
