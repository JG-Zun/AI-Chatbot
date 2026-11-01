# Full-Stack AI Chatbot

A lightweight, modern full-stack AI chatbot application featuring a **React (Vite)** frontend and a **Node.js & Express** backend integrated with the **Google Gemini API**.

---

## Project Structure

```text
ai-chat-app/
├── ai-chat-backend/     # Express server & Gemini API integration
├── ai-chat-frontend/    # React (Vite) user interface
└── .gitignore           # Root git ignore rules for secrets and dependencies
```

Prerequisites

```
Make sure you have the following installed on your machine:

Node.js (v18 or higher recommended)

npm (comes packaged with Node.js)

A free Google Gemini API Key (get one from Google AI Studio)

Setup & Installation
```

1. Clone the Repository

```
git clone https://github.com/YOUR-USERNAME/ai-chat-app.git
cd ai-chat-app
```

2. Backend Setup

```
Navigate to the backend folder:

cd ai-chat-backend

Install dependencies:

npm install

Create a .env file in the ai-chat-backend/ directory:

PORT=5000
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

3. Frontend Setup

```
Open a new terminal window/tab and navigate to the frontend folder from the root directory:

cd ai-chat-frontend

Install dependencies:

npm install

Running the Application

To run the app locally, start both the backend server and frontend client in separate terminal windows.
```

Step 1: Start the Backend Server

```
In your backend terminal (ai-chat-backend/):

node server.js

The server will start running at http://127.0.0.1:5000.
```

Step 2: Start the Frontend Client

```
In your frontend terminal (ai-chat-frontend/):

npm run dev
```

Vite will start the development server at http://localhost:5173.

Open http://localhost:5173 in your browser to start chatting!
