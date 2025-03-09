require("dotenv").config();
const axios = require("axios");
const db = require("./db.service");



class ChatbotService {
    constructor() {
        this.FASTAPI_URL = "http://localhost:8000/tinyllama-generate"; // ✅ Local FastAPI server
    }

    /**
     * Generate AI response using TinyLlama
     * @param {string} userInput - User's input message
     * @param {string} email - User's email (unique identifier)
     * @returns {Promise<object>} - Returns the chatbot response
     */
    async createChatByEmail(userInput, email) {
        try {
            if (!email) {
                throw new Error("User email cannot be empty.");
            }

            const response = await axios.post(this.FASTAPI_URL, { user_input: userInput });

            if (!response.data || !response.data.response) {
                throw new Error("Invalid AI response format.");
            }

            const aiResponse = response.data.response.trim();


            const newChat = {
                email,
                message: userInput,
                aiResponse,
                timestamp: new Date().toISOString()
            };

            const data = await db.readData();
            if (!data.chatHistory) {
                data.chatHistory = [];
            }

            data.chatHistory.push(newChat);
            await db.writeData(data);

            return newChat;
        } catch (error) {
            console.error("Failed to create chat record:", error);
            throw new Error("Failed to generate AI response: " + error.message);
        }
    }

    /**
     * Retrieve chat history by Email
     * @param {string} email - User's email
     * @returns {Promise<object[]>} - Returns an array of chat records
     */
    async getChatHistoryByEmail(email) {
        try {
            const data = await db.readData();

            if (!data.chatHistory || !Array.isArray(data.chatHistory)) {
                return [];
            }

            return data.chatHistory
                .filter(chat => chat.email === email)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error("Failed to retrieve chat history:", error);
            throw new Error("Failed to retrieve chat history: " + error.message);
        }
    }

    /**
     * Delete a specific chat message by Email and Message ID
     * @param {string} email - User's email
     * @param {string} messageId - Chat message timestamp
     * @returns {Promise<object>} - Success or failure message
     */
    async deleteChatByEmailAndMessageId(email, messageId) {
        try {
            const data = await db.readData();

            if (!data.chatHistory || !Array.isArray(data.chatHistory)) {
                return { success: false, message: "No chat history available." };
            }

            // Find the message to delete
            const filteredChats = data.chatHistory.filter(
                chat => !(chat.email === email && chat.timestamp === messageId)
            );

            // If no message was deleted, return not found
            if (filteredChats.length === data.chatHistory.length) {
                return { success: false, message: "Chat message not found." };
            }

            // Save updated chat history
            data.chatHistory = filteredChats;
            await db.writeData(data);

            return { success: true, message: "Chat message deleted." };
        } catch (error) {
            console.error("Failed to delete chat message:", error);
            throw new Error(error.message);
        }
    }

    /**
     * Delete all chat records for a given Email
     * @param {string} email - User's email
     * @returns {Promise<object>} - Success or failure message
     */
    async deleteAllChatsByEmail(email) {
        try {
            const data = await db.readData(); // Read current data

            // Ensure chatHistory exists and is an array
            if (!data.chatHistory || !Array.isArray(data.chatHistory)) {
                return { success: false, message: "No chat history found." };
            }

            // Find messages for this email
            const userChats = data.chatHistory.filter(chat => chat.email === email);

            // If no chats exist for the provided email, return an appropriate message
            if (userChats.length === 0) {
                return { success: false, message: `No chat messages found for email: ${email}` };
            }

            // Remove all messages for this email
            data.chatHistory = data.chatHistory.filter(chat => chat.email !== email);

            // Write the updated data back to the file (PERSIST CHANGES)
            await db.writeData(data);

            // Read back the file to ensure changes were saved correctly
            const newData = await db.readData();

            // Double-check if messages were actually removed
            const remainingChats = newData.chatHistory.filter(chat => chat.email === email);
            if (remainingChats.length > 0) {
                return { success: false, message: `Failed to delete all messages for email: ${email}` };
            }
            return { success: true, message: `All chat records for ${email} have been deleted.` };
        } catch (error) {
            console.error("Failed to delete chat history by email:", error);
            throw new Error("Internal server error: " + error.message);
        }
    }
}

module.exports = new ChatbotService();
