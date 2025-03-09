"use client";

import { useState } from "react";
import styles from "./chat.module.css";
import { sendChatMessage, getChatHistory } from "../../library/chatApi";


type Message = {
  role: "user" | "ai"; // ensure role is either "user" or "ai"
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const userEmail = "yansabrina66@gmail.com";

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to state
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");

    try {
      // Send message to backend
      const response = await sendChatMessage(userEmail, userMessage);
      if (response.success) {
        setMessages((prev) => [...prev, { role: "ai", content: response.data.aiResponse }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
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
