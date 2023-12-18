// App.js
import React, { useState, useRef, useEffect } from "react";
import "./Home.css"; // Import your CSS file for styling

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const chatBoxRef = useRef(null);

  const pages = ["Page 1", "Page 2", "Page 3"]; // Replace with your actual pages

  const appendMessage = (role, text) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  const appendToSearchHistory = (message) => {
    setSearchHistory((prevSearchHistory) => [...prevSearchHistory, message]);
  };

  const sendMessage = () => {
    if (!userMessage || isLocked || loading) return; // Disable input during loading

    setLoading(true);
    setError(null);

    appendMessage("User", userMessage);
    appendToSearchHistory(userMessage);

    fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.messages) {
          data.messages.forEach((message) => {
            setLoading(false);
            appendMessage("Bot", message.text);
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("An error occurred. Please try again.");
        setLoading(false);
      });

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
    <div className="app-container">
      <header className="app-header">
        <div className="navbar">
          {/* <div className="brand">Prakriti Chatbot</div> */}
          <div className="sidebar">
            <ul>
              {pages.map((page, index) => (
                <li key={index}>{page}</li>
              ))}
            </ul>
          </div>
          <div className="logout-button">
            <button onClick={() => console.log("Implement your logout logic here")}>
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="app-content">
        <div className="chat-box-container" ref={chatBoxRef}>
          <div className="chat-box">
            {messages.map((message, index) => (
              <div key={index} className={message.role.toLowerCase()}>
                <strong>{message.role}:</strong> {message.text}
              </div>
            ))}
            {loading && <div className="loading-spinner"></div>}
            {error && <div className="bot" style={{ color: "red" }}>{error}</div>}
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
  );
};

export default App;
