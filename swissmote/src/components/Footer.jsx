import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

const Footer = ({ onNext, onPrev }) => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <button
        className="footer-btn upload-btn"
        onClick={() => navigate("/upload")}
      >
        Upload
      </button>

      <button
        className="footer-btn profile-btn"
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>
    </footer>
  );
};

export default Footer;
