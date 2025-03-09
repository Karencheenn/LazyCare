import api from "./api";

// post chat history
import axios from "axios";

// Define backend URL
const BASE_URL = "http://localhost:5000";  // ✅ Must match backend

// POST: Send user input to backend
export const sendChatMessage = async (email: string, userInput: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/chat/${email}`, { userInput });
        return response.data;
    } catch (error) {
        console.error("Error sending chat message:", error);
        throw error;
    }
};

// GET: Retrieve chat history
export const getChatHistory = async (email: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/chat/${email}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};


// delte certain chat history
export const deleteChatMessage = async (email: string, messageId: string) => {
    try {
      const response = await api.delete(`/chat/${email}/${messageId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting chat message:", error);
      throw error;
    }
  };

// delete all chat history
export const deleteAllChatHistory = async (email: string) => {
    try {
      const response = await api.delete(`/chat/email/${email}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting all chat history:", error);
      throw error;
    }
  };
