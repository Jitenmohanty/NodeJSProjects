import React, { useState, useRef, useEffect } from "react";
import { BotMessageSquare, Send, X, MinusIcon, Loader2 } from "lucide-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popups, setPopups] = useState({
    first: true,
    second: false,
    third: false,
    fourth: false
  });
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

    // Schedule popups
    const timeouts = [
      setTimeout(() => setPopups(prev => ({ ...prev, first: false })), 5000),
      setTimeout(() => setPopups(prev => ({ ...prev, second: true })), 10000),
      setTimeout(() => {
        setPopups(prev => ({ ...prev, second: false }));
        setPopups(prev => ({ ...prev, third: true }));
      }, 15000),
      setTimeout(() => {
        setPopups(prev => ({ ...prev, third: false }));
        setPopups(prev => ({ ...prev, fourth: true }));
      }, 20000),
      setTimeout(() => setPopups(prev => ({ ...prev, fourth: false })), 25000)
    ];

    return () => timeouts.forEach(timeout => clearTimeout(timeout));
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

  const closePopup = (popupName) => {
    setPopups(prev => ({ ...prev, [popupName]: false }));
  };

  const renderPopup = (name, content, gradient, position) => {
    if (!popups[name] || isOpen) return null;
    
    return (
      <div className={`fixed ${position} flex items-center space-x-2 animate-fade-in-up`}>
        <div className={`${gradient} p-3 rounded-full shadow-lg shadow-purple-500/50 text-white`}>
          <BotMessageSquare size={24} />
        </div>
        <div className="relative bg-white shadow-lg rounded-lg p-4 text-gray-800 border border-gray-200 transform transition-all duration-300 hover:scale-105">
          <button 
            onClick={() => closePopup(name)}
            className="absolute -top-2 -right-2 bg-gray-400 text-black rounded-full p-0.5 hover:bg-red-600 transition-colors"
          >
            <X size={16}  />
          </button>
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="[--fade-in-duration:500ms] [--bounce-in-duration:800ms] [--slide-in-duration:500ms]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 0.9; transform: scale(1.1); }
          70% { opacity: 0.95; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in-up {
          animation: fadeInUp var(--fade-in-duration) ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounceIn var(--bounce-in-duration) cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        .animate-slide-in {
          animation: slideIn var(--slide-in-duration) ease-out forwards;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
      `}</style>

      {renderPopup(
        "first",
        <>
          <p className="font-medium">👋 Welcome! Need any assistance?</p>
          <p className="text-sm text-gray-600 mt-1">I'm here to help you!</p>
        </>,
        "bg-gradient-to-r from-blue-500 to-purple-700",
        "bottom-32 right-10"
      )}

      {renderPopup(
        "second",
        <>
          <p className="font-medium">💡 Did you know?</p>
          <p className="text-sm text-gray-600 mt-1">I can help you with various tasks and questions!</p>
        </>,
        "bg-gradient-to-r from-green-500 to-teal-700",
        "bottom-52 right-10"
      )}

      {renderPopup(
        "third",
        <>
          <p className="font-medium">🚀 Quick Tip!</p>
          <p className="text-sm text-gray-600 mt-1">
            You can ask me about job applications, resume tips, or interview guidance!
          </p>
        </>,
        "bg-gradient-to-r from-orange-500 to-red-500",
        "bottom-72 right-10"
      )}

      {renderPopup(
        "fourth",
        <>
          <p className="font-medium">🤖 Try me!</p>
          <p className="text-sm text-gray-600 mt-1">
            Ask me anything related to ATS, recruitment, or career advice.
          </p>
        </>,
        "bg-gradient-to-r from-purple-500 to-pink-500",
        "bottom-92 right-10"
      )}

      {!isOpen ? (
        <div className="fixed bottom-6 right-6">
          <div
            onClick={() => {
              setIsOpen(true);
              setPopups({
                first: false,
                second: false,
                third: false,
                fourth: false
              });
            }}
            className="absolute bottom-4 right-4 cursor-pointer p-3 rounded-full 
                       bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg 
                       shadow-purple-500/50 text-white hover:scale-110 
                       transition-transform duration-300 animate-bounce"
          >
            <BotMessageSquare size={40} className="drop-shadow-lg" />
          </div>
        </div>
      ) : (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 animate-slide-in">
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
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === user.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.sender === user.id
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                          }`}
                        >
                          {msg.sender === user.id ? (
                            <p>{msg.text}</p>
                          ) : (
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                          )}
                          <p className="text-xs mt-1 opacity-70">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {loading && (
                      <div className="flex justify-start animate-pulse">
                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                        <p className="text-sm ml-2 text-black">AI is typing...</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-gray-200"
                >
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
      )}
    </div>
  );
};

export default ChatInterface;