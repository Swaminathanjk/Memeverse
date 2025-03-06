MemeVerse 🎭 - The Ultimate Meme Sharing Platform

MemeVerse is a fun, interactive meme-sharing platform where users can
upload, edit, and explore memes. With a modern UI, infinite scrolling,
and a profile section like Instagram, it's designed to be the perfect
meme hub! 🚀🔥

🚀 Features

✅ User Authentication (Register, Login, JWT Authentication)✅ Meme
Uploads (via Cloudinary)✅ Meme Editing (Change caption & image)✅
Infinite Scrolling (Randomized meme display)✅ Instagram-Style Profile
Section (User-uploaded memes)✅ Custom Black-Themed Scrollbar✅ Funky
Header & Footer Design✅ Dark Mode Interface

🛠 Tech Stack

Frontend:

React (Vite)

Axios (API requests)

React Router (Navigation)

Vanilla CSS (Custom Styling)

Framer Motion/GSAP (Animations)

Backend:

Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Cloudinary (Image Uploads)

Multer (File Handling)

📀 Installation & Setup

1️⃣ Clone the Repository

git clone https://github.com/yourusername/memeverse.git cd memeverse

2️⃣ Install Dependencies

npm install cd client && npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4️⃣ Start the Development Server

\# Start Backend npm run dev

\# Start Frontend cd client && npm run dev

🚀 The app will be available at http://localhost:5173

📂 Folder Structure

memeverse/ │── client/ \# Frontend Code (React) │ └── src/ │ ├──
components/ \# Reusable UI Components │ ├── pages/ \# Profile, Home,
Upload, Edit │ ├── styles/ \# CSS Stylesheets │ ├── App.js \# Main React
Component │ └── main.js \# Entry Point │── server/ \# Backend Code
(Node.js, Express) │ ├── models/ \# Mongoose Models │ ├── routes/ \#
Express API Routes │ ├── config/ \# Cloudinary & DB Config │ └──
index.js \# Server Entry Point │── README.md \# Project Documentation

🌟 API Endpoints

🔐 Authentication

Method

Endpoint

Description

POST

/api/auth/register

User Registration

POST

/api/auth/login

User Login

🖼️ Meme Management

Method

Endpoint

Description

GET

/api/memes/

Get all memes

POST

/api/memes/upload

Upload a meme

GET

/api/memes/:id

Get a meme by ID

PUT

/api/memes/:id

Update meme caption & image

DELETE

/api/memes/:id

Delete a meme

👤 Profile

Method

Endpoint

Description

GET

/api/users/:id/memes

Get user-uploaded memes

PUT

/api/users/:id/update-profile

Update profile bio & picture

🔖 Future Enhancements

📉 Meme Reactions (Likes, Comments, Shares)🔔 Chat Feature (Coming
Soon\...)🎉 Explore Page with Trending Memes📹 GIF & Video Meme Support

🎨 UI Screenshots

👥 Contributing

Want to contribute?1️⃣ Fork the repo2️⃣ Create a new branch
(feature-new)3️⃣ Commit your changes4️⃣ Open a pull request

📚 License

🗃 This project is licensed under the MIT License.

📢 Contact

📧 Email: your-email@example.com🐙 GitHub: yourusername🔗 Website:
yourwebsite.com
