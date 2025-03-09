"use client";

import { useState } from "react";
import styles from "./chat.module.css";

type Message = {
  role: "user" | "ai"; // ensure role is either "user" or "ai"
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    // api integration future
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", content: "This is a placeholder AI response." }]);
    }, 1000);
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
