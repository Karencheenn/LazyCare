require("dotenv").config();
const axios = require("axios");
const db = require("./db.service");



class ChatbotService {
    constructor() {
        this.HF_API_URL = "https://api-inference.huggingface.co/models/TinyLlama/TinyLlama-1.1B-Chat-v1.0"; // ✅ TinyLlama Model
        this.HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
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
                throw new Error("Email cannot be empty.");
            }

            const headers = {
                Authorization: `Bearer ${this.HF_API_KEY}`,
                "Content-Type": "application/json"
            };

            const requestBody = {
                inputs: `User: ${userInput}\nAssistant:`, // ✅ TinyLlama Chat Format
                parameters: {
                    max_new_tokens: 256,
                    temperature: 0.7,
                    top_p: 0.95
                }
            };

            const response = await axios.post(this.HF_API_URL, requestBody, { headers });

            if (!response.data || !response.data[0]?.generated_text) {
                throw new Error("Invalid AI response format.");
            }

            const aiResponse = response.data[0].generated_text.trim();

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
