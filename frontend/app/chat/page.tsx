"use client";

import { useState, useEffect } from "react";
import styles from "./chat.module.css";

type Message = {
  role: "user" | "ai"; // ensure role is either "user" or "ai"
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const userEmail = "user@example.com"; // Replace with the actual user email logic

  // Function to fetch chat history
  async function fetchChatHistory(email: string) {
    const response = await fetch(`/chat/${email}`);
    const data = await response.json();
    return data.success ? data.data : [];
  }

  // Function to send a message
  async function sendMessage(email: string, userInput: string) {
    const response = await fetch(`/chat/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  }

  // Load chat history when the component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      const chatHistory = await fetchChatHistory(userEmail);
      displayChatMessages(chatHistory); // Call to display chat messages
    };

    loadChatHistory();
  }, [userEmail]); // Dependency array includes userEmail

  // Display chat messages in the UI
  const displayChatMessages = (history: any[]) => {
    // Ensure history is an array and format messages correctly
    if (Array.isArray(history)) {
      const formattedMessages = history.map((msg: any) => ({
        role: msg.role || "ai", // Adjust based on your data structure
        content: msg.content || "No content", // Fallback for missing content
      }));
      setMessages(formattedMessages);
    } else {
      console.error("Chat history is not an array:", history);
    }
  };

  // Handle user message
  const handleUserMessage = async (userInput: string) => {
    const newMessage = await sendMessage(userEmail, userInput);
    if (newMessage) {
      updateChatUI(newMessage); // Update the chat UI with the new message
    }
  };

  // Update chat UI
  const updateChatUI = (newMessage: string) => {
    setMessages((prev) => [...prev, { role: "ai", content: newMessage }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    
    // Send the message to the backend
    await handleUserMessage(input); // Call the function to handle user message
    setInput(""); // Clear the input field
  };

  return (
    <div className={styles.chatContainer}>
      {/* chat history area */}
      <div className={styles.chatHistory}>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? styles.userMessage : styles.aiMessage}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* input box */}
      <div className={styles.inputContainer}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className={styles.inputBox}
          rows={2}
        ></textarea>
        <button onClick={handleSendMessage} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
