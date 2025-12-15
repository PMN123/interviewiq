# InterviewIQ

> AI-Powered Interview Preparation Platform

## 🎥 Demo

[![InterviewIQ Demo](https://img.youtube.com/vi/6iDoK4Sc9AQ/maxresdefault.jpg)](https://youtu.be/6iDoK4Sc9AQ)


## 📋 Project Overview

InterviewIQ is a full-stack MERN application designed to help job seekers prepare for technical interviews through AI-powered practice sessions. Users can receive personalized interview questions, submit their answers, and get detailed AI-generated feedback with optional voice playback.

**Built for:** CS390 Capstone Project  
**Tech Stack:** MongoDB, Express.js, React, Node.js + OpenAI + ElevenLabs

---

## 🎯 Problem Statement

Job interviews are stressful, and many candidates struggle with:
- Not knowing what questions to expect for their target role
- Lack of practice opportunities with realistic scenarios
- No feedback mechanism to improve their responses
- Difficulty simulating real interview pressure

**InterviewIQ solves these problems** by providing an AI-powered platform where users can practice unlimited interviews tailored to their specific role and experience level, receive instant constructive feedback, and even hear questions/feedback spoken aloud for a more immersive experience.

---

## ✨ Features

### Core Features
- **User Authentication** - Secure registration and login with JWT tokens
- **Interview Sessions (Full CRUD)** - Create, view, update, and delete practice sessions
- **Role-Specific Questions** - AI generates realistic questions based on job role and difficulty
- **AI Feedback Analysis** - Detailed feedback on answers with strengths and improvement areas
- **Voice Synthesis** - Listen to questions and feedback with natural AI voices
- **Progress Tracking** - Dashboard to monitor all practice sessions

### Technical Features
- Protected routes with JWT authentication
- Secure password hashing with bcrypt
- MongoDB Atlas cloud database
- RESTful API architecture
- Responsive design for all devices
- Error handling and loading states

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Functional components with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### External APIs
- **OpenAI GPT-3.5** - Question generation and answer analysis
- **ElevenLabs** - Text-to-speech synthesis

### Deployment
- **Frontend:** Vercel
- **Backend:** Render / Railway

---

## 📁 Project Structure

```
InterviewIQ/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── interviewController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── InterviewSession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   ├── package.json
│   └── env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── InterviewSessionCard.js
│   │   │   └── CreateInterviewForm.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── Dashboard.js
│   │   │   └── InterviewDetailPage.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── env.example
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account
- OpenAI API key
- ElevenLabs API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/interviewiq.git
cd interviewiq
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp env.example .env

# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
cp env.example .env

# Edit .env with your API URL
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## ⚙️ Environment Variables

### Backend (.env)
```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewiq

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key

# ElevenLabs API Key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Server Port
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Interview Sessions
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/interviews` | Create interview | Yes |
| GET | `/api/interviews` | Get all user interviews | Yes |
| GET | `/api/interviews/:id` | Get single interview | Yes |
| PUT | `/api/interviews/:id` | Update interview | Yes |
| DELETE | `/api/interviews/:id` | Delete interview | Yes |

### AI Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/ai/generate-question` | Generate interview question | Yes |
| POST | `/api/ai/analyze-answer` | Analyze user's answer | Yes |
| POST | `/api/ai/generate-audio` | Convert text to speech | Yes |

---

## 🖼 Screenshots

### Home Page
![Home Page](https://via.placeholder.com/800x500/0a0a0f/8b5cf6?text=Home+Page)

### Dashboard
![Dashboard](https://via.placeholder.com/800x500/0a0a0f/8b5cf6?text=Dashboard)

### Interview Session
![Interview Session](https://via.placeholder.com/800x500/0a0a0f/8b5cf6?text=Interview+Session)

### AI Feedback
![AI Feedback](https://via.placeholder.com/800x500/0a0a0f/8b5cf6?text=AI+Feedback)

---

## 🌐 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Frontend (Vercel)
1. Import project to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL`
4. Deploy

### Deployment Links
- **Frontend:** [https://interviewiq.vercel.app](https://interviewiq.vercel.app)
- **Backend API:** [https://interviewiq-api.onrender.com](https://interviewiq-api.onrender.com)

---

## 🔒 Security Features

- Passwords hashed with bcrypt (12 salt rounds)
- JWT tokens for authentication
- Protected API routes
- User data isolation (users can only access their own data)
- API keys stored securely in environment variables
- CORS configured for allowed origins
- Input validation on all endpoints

---

## 📝 License

This project is created for educational purposes as part of CS390 Capstone.

---

## 👨‍💻 Author

**Praniil Nagaraj, Monish Jonnadula*  
CS390 Capstone Project  
Purdue University

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT API
- [ElevenLabs](https://elevenlabs.io) for Text-to-Speech API
- [MongoDB Atlas](https://www.mongodb.com/atlas) for database hosting
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting

