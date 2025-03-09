require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const userController = require('./src/controllers/user.controller');
const chatbotController = require('./src/controllers/chatbot.controller');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // allow frontend to access
    credentials: true, // allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log("OLLAMA_API_URL:", process.env.OLLAMA_API_URL);
console.log("PORT:", process.env.PORT);

app.use(express.json());

// Ollama API
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/generate";
const MODEL_NAME = "llama2";

// api integration
app.use('/user', userController); // for user profile
app.use('/chat', chatbotController); // for chat history

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});