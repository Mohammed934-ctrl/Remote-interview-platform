📌 Remote Interview Platform

A full-stack remote interview platform that enables hosts and participants to conduct live video interviews, collaborate in a real-time code editor, and manage interview sessions securely.

Built with modern technologies and designed for real-world interview workflows.

🚀 Live Demo

🔗 Live App:
https://remote-interview-platform-tuj5.onrender.com

🖼️ Screenshots

### Dashboard
![Dashboard](Frontend/src/assets/dashboard.png)

Interview Session
![Session](Frontend/src/assets/session.png)



✨ Features

🔐 Authentication & Authorization

Secure login using Clerk

Role-based access (Host / Participant)

🎥 Live Video Interviews

Real-time video & audio using Stream Video SDK

💻 Collaborative Code Editor

Monaco Editor for live coding during interviews

📅 Session Management

Create, join, end interview sessions

View active and recent sessions

⚡ Real-time Updates

Backend events powered by Inngest

🌐 Production Deployment

Fully deployed on Render

🛠️ Tech Stack
Frontend

React (Vite)

Tailwind CSS + DaisyUI

Axios

TanStack React Query

Monaco Editor

Clerk (Auth)

Backend

Node.js

Express.js

MongoDB

Inngest

Clerk Middleware

Third-Party Services

Clerk – Authentication

Stream – Video calls

Render – Deployment

🧠 Architecture Overview
Frontend (React + Vite)
        |
        |  Axios (with credentials)
        v
Backend (Express + MongoDB)
        |
        ├── Clerk (Auth)
        ├── Stream (Video)
        └── Inngest (Background jobs)

⚙️ Environment Variables
Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=your_key_here

Backend (.env)
PORT=3000
MONGO_URI=your_mongo_uri
CLERK_SECRET_KEY=your_secret_key
CLIENT_URL=http://localhost:5173



🧪 Local Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/remote-interview-platform.git
cd remote-interview-platform

2️⃣ Install dependencies
Backend
cd Backend
npm install
npm run dev

Frontend
cd Frontend
npm install
npm run dev

📦 API Base Path

All backend APIs are prefixed with:

/api


Example:

POST /api/sessions
GET  /api/sessions/active

🚀 Deployment Notes

Frontend and backend are deployed on Render

Environment variables are injected at build time

Axios uses withCredentials: true for Clerk authentication

Backend serves frontend static files in production

📌 Key Learnings

Handling authentication with cookies in production

Debugging CORS and environment variable issues

Vite environment variable behavior (build-time only)

Clean separation of frontend & backend logic

🙌 Acknowledgements

Clerk Documentation

Stream Video SDK

Render Deployment Docs
