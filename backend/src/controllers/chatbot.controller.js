const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');

class ChatController {
    /**
     * Store chat messages by Email
     * POST /chat/:email
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
    
            // ✅ 获取用户的历史聊天记录
            const history = await this.getChatHistoryByEmail(email);
    
            // ✅ 只保留最近 5 条记录，避免 token 过载
            const recentMessages = history.slice(0, 5)
                .map(chat => `User: ${chat.message}\nAssistant: ${chat.aiResponse}`)
                .join("\n");
    
            // ✅ 构造 AI 请求的 inputs（加上历史对话）
            const requestBody = {
                inputs: `${recentMessages}\nUser: ${userInput}\nAssistant:`,
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
    
            // ✅ 存储新的对话记录
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
     * Retrieve user chat history by Email
     * GET /chat/:email
     */
    async getChatHistory(req, res) {
        try {
            const { email } = req.params;
            const history = await chatbotService.getChatHistoryByEmail(email);

            res.status(200).json({ success: true, data: history });
        } catch (error) {
            console.error("Error retrieving chat history:", error);
            res.status(500).json({ success: false, error: "Failed to retrieve chat history: " + error.message });
        }
    }

    /**
     * Delete a specific chat message by Email
     * DELETE /chat/:email/:messageId
     */
    async deleteChatMessage(req, res) {
        try {
            const { email, messageId } = req.params;
            const result = await chatbotService.deleteChatByEmailAndMessageId(email, messageId);

            if (!result.success) {
                return res.status(404).json({ success: false, error: "Chat message not found" });
            }

            res.status(200).json({ success: true, message: "Chat message deleted" });
        } catch (error) {
            console.error("Error deleting chat message:", error);
            res.status(500).json({ success: false, error: "Failed to delete chat message: " + error.message });
        }
    }

    /**
     * Delete all chat records for a given email
     * DELETE /chat/email/:email
     */
    async deleteChatByEmail(req, res) {
        try {
            const { email } = req.params;
            const result = await chatbotService.deleteAllChatsByEmail(email);

            // Make sure the correct message is returned
            if (!result.success) {
                return res.status(404).json({ success: false, error: result.message });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting all chat records:", error);
            res.status(500).json({ success: false, error: "Failed to delete chat records: " + error.message });
        }
    }

}

// Instantiate the controller
const chatController = new ChatController();

// Define routes
router.post('/:email', async (req, res) => chatController.saveChatMessage(req, res));
router.get('/:email', (req, res) => chatController.getChatHistory(req, res));
router.delete('/:email/:messageId', (req, res) => chatController.deleteChatMessage(req, res));
router.delete('/email/:email', (req, res) => chatController.deleteChatByEmail(req, res));

module.exports = router;
