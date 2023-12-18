// App.js

import React, { useState, useRef, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./Home.css"; // Import your CSS file for styling

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const chatBoxRef = useRef(null);

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const sendMessage = async () => {
    if (!userMessage || isLocked || loading) return;

    setLoading(true);
    setError(null);

    appendMessage("User", userMessage);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.messages) {
        for (const message of data.messages) {
          await new Promise((resolve) => {
            setTimeout(() => {
              setLoading(false);
              appendMessage("Bot", message.text);
              resolve();
            }, 100); // Adjust the duration as needed
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
    }

    setUserMessage("");
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  // Scroll chat box to the bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="navbar">
            <div className="brand">Prakriti Chatbot</div>
          </div>
        </header>
        <div className="app-content">
          <div className="chat-box-container" ref={chatBoxRef}>
            <div className="chat-box">
              {messages.map((message, index) => (
                <div key={index} className={message.role.toLowerCase()}>
                  <strong>{message.role}:</strong>{" "}
                  {message.role === "Bot" && (
                    <span className="typing-animation">{message.text}</span>
                  )}
                  {message.role !== "Bot" && message.text}
                </div>
              ))}
              {loading && <div className="bot"></div>}
              {error && (
                <div className="bot" style={{ color: "red" }}>
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="app-input">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Type your message"
            disabled={isLocked}
          />
          <button onClick={sendMessage} disabled={isLocked}>
            Send
          </button>
        </div>
      </div>
    </Router>
  );
};

export default App;
