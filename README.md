# Hackathon-project
# InterviewPro.AI 🎤📄

**InterviewPro.AI** is an intelligent mock interview assistant that helps users prepare for job interviews. It analyzes a user’s uploaded resume and generates 5–10 personalized interview questions, along with resume improvement suggestions using Gemini AI.

---

## ✨ Features

- ✅ Upload resume in `.pdf`, `.docx`, or `.txt` format.
- 🤖 AI-powered resume analysis.
- 🎯 Generates 5–10 tailored mock interview questions.
- 💡 Provides actionable feedback to improve the resume.
- 🗣️ (Coming Soon) Voice-based answering and AI feedback per question.

---

## 🔧 Tech Stack

### Frontend
- **React** – UI and state management.
- **Tailwind CSS / Custom CSS** – Styling.

### Backend
- **Node.js** + **Express** – REST API server.
- **Multer** – File upload middleware.
- **pdf-parse** – Extracts text from PDF files.
- **fs** – File system operations.
- **dotenv** – Manage API keys securely.
- **node-fetch** – For making API calls to Gemini.

---

## 🤖 AI & Cloud APIs Used

- **Google Gemini API** (`generativelanguage.googleapis.com`)
  - Model: `gemini-pro` (used via `generateContent`)
  - Used to generate interview questions and resume feedback.

---



