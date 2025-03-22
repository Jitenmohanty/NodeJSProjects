import React, { createContext, useContext, useState, useEffect } from "react";

const ChatBotContext = createContext();

export const ChatBotProvider = ({ children }) => {
  const [botMessages, setBotMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch chat history from the backend
  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/bot/chatbot/history", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data && data.chatHistory) {
        setBotMessages(data.chatHistory.map(chat => ([
          { text: chat.userMessage, sender: "user", timestamp: chat.createdAt },
          { text: chat.botResponse, sender: "bot", timestamp: chat.createdAt }
        ])).flat());
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message to the chatbot
  const sendMessageToBot = async (userMessage) => {
    setLoading(true);
    
    // Add user message immediately
    const timestamp = new Date().toISOString();
    setBotMessages((prev) => [
      ...prev,
      { text: userMessage, sender: "user", timestamp }
    ]);
  
    try {
      const response = await fetch("http://localhost:3000/bot/chatbot", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: userMessage }),
      });
  
      const data = await response.json();
  
      if (data && data.data) {
        // Add bot response
        const botTimestamp = new Date().toISOString();
        setBotMessages((prev) => [
          ...prev,
          { text: data.data, sender: "bot", timestamp: botTimestamp }
        ]);
      }
    } catch (error) {
      console.error("Error communicating with chatbot:", error);
      setBotMessages((prev) => [
        ...prev,
        { 
          text: "Sorry, I'm having trouble connecting right now. Please try again later.", 
          sender: "bot", 
          timestamp: new Date().toISOString(),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history both locally and in the backend
  const clearChat = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/bot/chatbot/clear-history", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      setBotMessages([]); // Clear local state
    } catch (error) {
      console.error("Error clearing chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  return (
    <ChatBotContext.Provider value={{ 
      botMessages, 
      loading, 
      sendMessageToBot,
      clearChat
    }}>
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBot = () => useContext(ChatBotContext);
