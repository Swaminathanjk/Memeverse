import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // ✅ Import Sonner for toast notifications
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import Upload from "./pages/Upload";
import MemeDetails from "./pages/MemeDetails";
import Profile from "./pages/Profile";
import LeaderBoard from "./pages/LeaderBoard";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditMeme from "./pages/EditMeme";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* ✅ Toast Notifications Enabled */}
        <Toaster position="top-right" />

        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/meme/:id" element={<MemeDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/edit/:memeId" element={<EditMeme />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
