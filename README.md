# MemeVerse 🎭 - The Ultimate Meme Sharing Platform

MemeVerse is a fun, interactive meme-sharing platform where users can upload, edit, and explore memes. With a **modern UI**, **infinite scrolling**, and **a profile section like Instagram**, it’s designed to be the perfect meme hub! 🚀🔥

## **🚀 Features**

✅ **User Authentication** (Register, Login, JWT Authentication)  
✅ **Meme Uploads** (via Cloudinary)  
✅ **Meme Editing** (Change caption & image)  
✅ **Infinite Scrolling** (Randomized meme display)  
✅ **Instagram-Style Profile Section** (User-uploaded memes)  
✅ **Custom Black-Themed Scrollbar**  
✅ **Funky Header & Footer Design**  
✅ **Dark Mode Interface**

---

## **🛠 Tech Stack**

### **Frontend:**

- React (Vite)
- Axios (API requests)
- React Router (Navigation)
- Vanilla CSS (Custom Styling)
- Framer Motion/GSAP (Animations)

### **Backend:**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image Uploads)
- Multer (File Handling)

---

## **📌 Installation & Setup**

```sh
1️⃣ Clone the Repository**

git clone https://github.com/yourusername/memeverse.git
cd Memeverse

2️⃣ Install Dependencies

npm install
cd swissmote && npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4️⃣ Start the Development Server

# Start Backend
npm run dev

# Start Frontend
cd swissmote && npm run dev
```

🚀 The app will be available at http://localhost:5173

## **📂 Folder Structure**

```bash
memeverse/
│── client/                # Frontend Code (React)
│   ├── src/
│   │   ├── components/    # Reusable UI Components
│   │   ├── pages/         # Profile, Home, Upload, Edit
│   │   ├── styles/        # CSS Stylesheets
│   │   ├── App.js         # Main React Component
│   │   ├── main.js        # Entry Point
│── server/                # Backend Code (Node.js, Express)
│   ├── models/            # Mongoose Models
│   ├── routes/            # Express API Routes
│   ├── config/            # Cloudinary & DB Config
│   ├── index.js           # Server Entry Point
│── README.md              # Project Documentation
```

## 📜 API Endpoints

## _Prefix Backend host_

`http:/localhost:5000`

### 🔐 Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | User Registration |
| POST   | `/api/auth/login`    | User Login        |

### 🖼 Meme Management

| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/memes/`       | Get all memes               |
| POST   | `/api/memes/upload` | Upload a meme               |
| GET    | `/api/memes/:id`    | Get a meme by ID            |
| PUT    | `/api/memes/:id`    | Update meme caption & image |
| DELETE | `/api/memes/:id`    | Delete a meme               |

### 👤 Profile Management

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| GET    | `/api/users/:id/memes`          | Get user-uploaded memes      |
| PUT    | `/api/users/:id/update-profile` | Update profile bio & picture |

### 🔄 Meme Interactions (Future Features)

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| POST   | `/api/memes/:id/like`     | Like a meme            |
| POST   | `/api/memes/:id/comment`  | Comment on a meme      |
| GET    | `/api/memes/:id/comments` | Get comments on a meme |

---

## **🎯 Future Enhancements**

📌 Meme Reactions (Likes, Comments, Shares)\
📌 Chat Feature (Coming Soon...)\
📌 Explore Page with Trending Memes\
📌 GIF & Video Meme Support

## **🎨 UI Screenshots**

![image](https://github.com/user-attachments/assets/0bd1866c-3e51-46af-8b82-716339836e70)![image](https://github.com/user-attachments/assets/87e12697-9088-4c67-97c7-51989c7c9180)\
![image](https://github.com/user-attachments/assets/528db414-9d90-420f-9002-121d611b889e)![image](https://github.com/user-attachments/assets/a976609a-fc2b-4f09-8baf-2d3e8eae5882)\
![image](https://github.com/user-attachments/assets/cd6274f3-5e31-4659-95d9-d45d3fa3884f)![image](https://github.com/user-attachments/assets/b76c2900-f572-4092-9411-99e5e2ed1f6b)

## **📬 Contact**

📧 Email: `swaminathanjk@gmail.com`\
🐙 GitHub: Swaminathanjk\
🔗 Website: yourwebsite.com
