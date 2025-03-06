import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fix: Ensure `JSON.parse()` never gets `undefined`
  const getUserFromLocalStorage = () => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromLocalStorage());

  useEffect(() => {
    setUser(getUserFromLocalStorage());
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // ✅ Ensure user data is removed
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="logo" onClick={() => navigate("/")}>
        MemeVerse
      </h1>
      <nav className="nav-links">
        {token ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
        <button onClick={() => navigate("/chat")}>🗪</button>
      </nav>
    </header>
  );
};

export default Header;
