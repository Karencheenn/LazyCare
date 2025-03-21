# AI Health Assistant

## LazyCare
This project is an **AI Health Assistant** with a **Next.js frontend** and a **Node.js + Express backend**. The backend also integrates **FastAPI** to run an AI chatbot.

## System Requirements
- **Operating System**: Windows / macOS
- **Frontend**: Next.js
- **Backend**: Node.js + Express, FastAPI
- **AI Chatbot**: Runs on FastAPI

![Login-page](https://github.com/user-attachments/assets/fcd34bfe-a570-441e-9369-1188e00e7884)
![main-page](https://github.com/user-attachments/assets/063b44e4-6cef-4f50-8b8c-a94da9fa6922)
![user-profile-page](https://github.com/user-attachments/assets/3b92321b-6d3a-4502-bf4a-37da4b34263b)
![chat-page](https://github.com/user-attachments/assets/9a817bd8-7584-4824-957f-9b7b4c9515f5)
![Ai-analysis-page](https://github.com/user-attachments/assets/c89409bb-20af-4978-9b29-09c0c1c9a414)
![Delete-data-modal](https://github.com/user-attachments/assets/0f618106-1f53-4c2e-a94e-85f2ad68e75e)


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
The chatbot API will be available at http://localhost:8000/tinyllama-generate.

### 2. Start the Backend (Node.js + Express)
Run the following command in the `backend` directory:
```sh
node server.js
```
The backend will connect to http://localhost:5000.

### 3. Start the Frontend (Next.js)
Run the following command in the `frontend` directory:
```sh
npm run dev
```
The frontend will be available at http://localhost:3000.

## Additional Notes
- Ensure Python version 3.8 or higher.
- Ensure Node.js version 16.0 or higher.
- If `npm install` fails, try deleting the `node_modules` folder and `package-lock.json`, then reinstall:
```sh
rm -rf node_modules package-lock.json  # macOS/Linux
rd /s /q node_modules package-lock.json  # Windows
npm install
```

---
**Authors**: Aurore Zhang, Xu (Sabrina) Yan, Louis Zhang, and Karen Chen Lai

