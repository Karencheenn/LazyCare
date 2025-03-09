const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbot.service');

class ChatController {
    /**
     * Store chat messages by Email
     * POST /chat/:email
     */
    async saveChatMessage(req, res) {
        try {
            const { email } = req.params;
            const { userInput } = req.body;

            if (!userInput) {
                return res.status(400).json({ success: false, error: "User input cannot be empty" });
            }

            const chatRecord = await chatbotService.createChatByEmail(userInput, email);

            res.status(201).json({ success: true, data: chatRecord });
        } catch (error) {
            console.error("Error creating chat message:", error);
            res.status(500).json({ success: false, error: "Internal server error: " + error.message });
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
