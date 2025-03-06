import React , { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(token? JSON.parse(localStorage.getItem("user")) : null);
  
  const logout = () => {
    localStorage.removeItem("token");
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
