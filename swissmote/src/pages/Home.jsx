import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/home.css";

const Home = () => {
  const [memes, setMemes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setLoading(true);

        // Fetch premade memes from API
        const apiResponse = await axios.get(
          "https://api.imgflip.com/get_memes"
        );
        const apiMemes = apiResponse.data.data.memes.map((meme) => ({
          id: meme.id,
          name: meme.name,
          url: meme.url,
          likes: 0,
          owner: null, // Mark as MemeVerse upload
        }));

        // Fetch user-uploaded memes from backend
        const backendResponse = await axios.get(
          "http://localhost:5000/api/memes"
        );
        const userMemes = backendResponse.data.map((meme) => ({
          id: meme._id,
          name: meme.caption,
          url: meme.imageUrl,
          likes: meme.likes,
          owner: meme.owner,
        }));

        // Combine and shuffle memes randomly
        const combinedMemes = [...apiMemes, ...userMemes].sort(
          () => Math.random() - 0.5
        );
        setMemes(combinedMemes);
      } catch (error) {
        console.error("Error fetching memes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  // Handle next meme
  const handleNextMeme = () => {
    setCurrentIndex((prev) => (prev < memes.length - 1 ? prev + 1 : 0));
  };

  // Handle previous meme
  const handlePrevMeme = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : memes.length - 1));
  };

  // Handle touch/swipe on mobile
  const [startTouch, setStartTouch] = useState(0);

  const handleTouchStart = (e) => {
    const touchStart = e.touches[0].clientY;
    setStartTouch(touchStart);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientY;
    const swipeDistance = startTouch - touchEnd;

    // Check swipe distance and trigger appropriate action
    if (swipeDistance > 50) {
      handleNextMeme(); // Swipe Up
    } else if (swipeDistance < -50) {
      handlePrevMeme(); // Swipe Down
    }
  };

  useEffect(() => {
    let scrollTimeout;

    const handleWheelAndKeyScroll = (event) => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (event.deltaY > 0 || event.key === "ArrowDown") {
          handleNextMeme();
        } else if (event.deltaY < 0 || event.key === "ArrowUp") {
          handlePrevMeme();
        }
      }, 100);
    };

    // Adding event listeners for both wheel and key events (for desktop)
    window.addEventListener("wheel", handleWheelAndKeyScroll);
    window.addEventListener("keydown", handleWheelAndKeyScroll);

    // Adding touch events for mobile devices
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheelAndKeyScroll);
      window.removeEventListener("keydown", handleWheelAndKeyScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [memes]);

  return (
    <div className="home-container">
      {loading ? (
        <p className="loading-text">Loading memes...</p>
      ) : (
        <div className="meme-display">
          <img
            src={memes[currentIndex]?.url}
            alt={memes[currentIndex]?.name}
            className="meme-img"
          />
          <h3 className="meme-title">{memes[currentIndex]?.name}</h3>
          <p className="meme-owner">
            Uploaded by: {memes[currentIndex]?.owner?.username || "MemeVerse"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
