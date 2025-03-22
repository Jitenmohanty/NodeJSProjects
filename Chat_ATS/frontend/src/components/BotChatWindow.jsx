import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const BotChatWindow = ({ botMessages, selectBot }) => {
  const messagesEndRef = useRef(null);
  const [processedMessages, setProcessedMessages] = useState([]);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  // Initialize with welcome message
  useEffect(() => {
    if (botMessages && botMessages.length === 0) {
      // Only show welcome message if there are no messages yet
      setProcessedMessages([
        {
          text: `Hello ${user?.name || "there"}! I'm ${
            selectBot?.name || "ChatBot"
          }. How can I help you today?`,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } else {
      setProcessedMessages(botMessages);
    }
  }, [botMessages, selectBot, user]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [processedMessages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex-1 h-[78.5vh] overflow-y-auto p-4 ${
        darkMode ? "bg-gray-800" : "bg-gray-100"
      } rounded-lg shadow-lg overflow-y-auto custom-scrollbar`}
    >
      <div className="space-y-4 ">
        {processedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } space-x-3`}
          >
            {/* Bot/User Profile Picture (only show on left for bot messages) */}
            {msg.sender === "bot" && (
              <img
                src={selectBot?.profilePicture || "/bot-avatar.png"}
                alt="Bot"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            )}

            {/* Message Container */}
            <div
              className={`p-3 rounded-lg max-w-[75%] shadow-sm ${
                msg.sender === "user"
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-blue-500 text-white"
                  : darkMode
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
              <span
                className={`text-xs ${
                  msg.sender === "user"
                    ? "text-blue-100"
                    : darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                } block text-right mt-1`}
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>

            {/* User Profile Picture (only show on right for user messages) */}
            {msg.sender === "user" && (
              <img
                src={user?.profilePicture || "/default-avatar.png"}
                alt="User"
                className="w-10 h-10 rounded-full border border-gray-300 object-cover"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default BotChatWindow;