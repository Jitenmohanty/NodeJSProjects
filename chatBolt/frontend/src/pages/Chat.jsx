import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [roomId] = useState("default-room"); // Replace with dynamic room logic
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    socket.emit("userConnected", "user-id"); // Replace with actual user ID from JWT

    socket.on("newMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("userStatus", ({ userId, online }) => {
      setOnlineUsers((prev) =>
        online
          ? [...prev, userId]
          : prev.filter((id) => id !== userId)
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("userStatus");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;
    const data = { roomId, text: message, sender: "me" }; // Replace "me" with user ID
    socket.emit("sendMessage", data);
    setMessages((prev) => [...prev, data]);
    setMessage("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen max-w-4xl mx-auto p-4"
    >
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Chat Room</h1>
        <p className="text-sm text-gray-500">
          Online: {onlineUsers.length} user(s)
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-chatBg rounded-lg p-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ x: msg.sender === "me" ? 20 : -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`mb-3 flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "me"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <span className="font-semibold">{msg.sender}: </span>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Message Input */}
      <div className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Send
        </button>
      </div>
    </motion.div>
  );
};

export default Chat;