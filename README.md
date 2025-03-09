# AI Health Assistant

## Project Overview
This project is an **AI Health Assistant** with a **Next.js frontend** and a **Node.js + Express backend**. The backend also integrates **FastAPI** to run an AI chatbot.

## System Requirements
- **Operating System**: Windows / macOS
- **Frontend**: Next.js
- **Backend**: Node.js + Express, FastAPI
- **AI Chatbot**: Runs on FastAPI

## Installation
Before running the project, install all dependencies.

### 1. Install Node.js Dependencies
Run the following commands in both the `backend` and `frontend` folders:
```sh
cd backend  # Navigate to the backend folder
npm install  # Install backend dependencies

cd ../frontend  # Navigate to the frontend folder
npm install  # Install frontend dependencies
```

### 2. Install Python Dependencies (for FastAPI)
Run the following command in the `backend` folder:
```sh
pip install fastapi uvicorn
```
If the AI chatbot relies on `tinyllama_api`, ensure the necessary dependencies are installed:
```sh
pip install -r requirements.txt
```

## Running the Project
Follow these steps to start the project.

### 1. Start the AI Chatbot (FastAPI)
Run the following command in the `backend` directory:
```sh
uvicorn tinyllama_api:app --host 0.0.0.0 --port 8000 --reload
```
The chatbot API will be available at **http://localhost:8000/tinyllama-generate**.

### 2. Start the Backend (Node.js + Express)
Run the following command in the `backend` directory:
```sh
node server.js
```
The backend will connect to **http://localhost:8000**.

### 3. Start the Frontend (Next.js)
Run the following command in the `frontend` directory:
```sh
npm run dev
```
The frontend will be available at **http://localhost:3000**.

## Additional Notes
- Ensure Python version **3.8 or higher**.
- Ensure Node.js version **16.0 or higher**.
- If `npm install` fails, try deleting the `node_modules` folder and `package-lock.json`, then reinstall:
```sh
rm -rf node_modules package-lock.json  # macOS/Linux
rd /s /q node_modules package-lock.json  # Windows
npm install
```

## Contribution & Feedback
If you encounter any issues, feel free to submit an Issue or PR for improvements.

---
**Author**: Aurore Zhang, Xu (Sabrina) Yan, Louis Zhang, and Karen Chen Lai

