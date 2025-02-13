import React, { useState, useRef, useEffect } from "react";
import { BotMessageSquare, Send, X, MinusIcon, Loader2 } from "lucide-react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const aiBot = { id: "ai-bot", name: "AI Assistant", isBot: true };
  const user = { id: "user", name: "You", isBot: false };

  useEffect(() => {
    setMessages([
      {
        id: "initial-message",
        sender: aiBot.id,
        text: "How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: user.id,
      text: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/api/send", {
        text: inputMessage,
      });

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: aiBot.id,
        text: response.data.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform duration-300"
        >
          <BotMessageSquare className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6  right-6 w-80 sm:w-96">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BotMessageSquare className="w-6 h-6 text-white" />
            <h3 className="text-white font-medium">AI Assistant</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:text-gray-200"
            >
              <MinusIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="h-[70vh] overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === user.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      msg.sender === user.id 
                        ? "bg-blue-500 text-white rounded-br-none" 
                        : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                    }`}>
                      {msg.sender === user.id ? (
                        <p>{msg.text}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                    <p className="text-sm ml-2">AI is typing...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border text-black border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;