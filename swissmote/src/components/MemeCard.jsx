import React from "react";
import "../styles/memecard.css";

const MemeCard = ({ meme }) => {
    return (
      <div className="meme-card">
        <img src={meme.url} alt={meme.name} />
        <div className="meme-info">
          <h3>{meme.name}</h3>
          <p>Uploaded by: {meme.owner ? meme.owner.username : "MemeVerse"}</p>
        </div>
      </div>
    );
  };

export default MemeCard;
