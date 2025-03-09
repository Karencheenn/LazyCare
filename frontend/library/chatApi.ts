import api from "./api";

// post chat history
export const sendChatMessage = async (email: string, userInput: string) => {
    try {
      const response = await api.post(`/chat/${email}`, { userInput });
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  };

// get a user history
export const getChatHistory = async (email: string) => {
    try {
      const response = await api.get(`/chat/${email}`);
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
