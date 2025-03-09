require('dotenv').config();
const express = require('express');
const cors = require('cors');

const userController = require('./src/controllers/user.controller');
const chatbotController = require('./src/controllers/chatbot.controller');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // Allow frontend access
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log("TINYLLAMA_API_URL:", process.env.TINYLLAMA_API_URL || "http://localhost:8000/tinyllama-generate");
console.log("PORT:", PORT);

app.use(express.json());

// ✅ Route handlers (Delegating POST to chatbot.controller.js)
app.use('/user', userController); // User profile management
app.use('/chat', chatbotController); // Chat history & chatbot logic

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
