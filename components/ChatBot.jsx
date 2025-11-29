"use client";
import { useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMessage = { sender: "bot", text: data.reply };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-3">

      {/* Title */}
      <h2 className="text-lg font-bold mb-2">AI Chatbot</h2>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto border rounded p-2 bg-white">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`my-1 ${
              msg.sender === "user" ? "text-blue-600" : "text-green-600"
            }`}
          >
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
