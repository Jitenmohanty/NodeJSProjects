import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatInterface from "./ChatInterface";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const { user, socket } = useAuth();

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (!openChat || data.message.sender !== user?.id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.message.sender]: (prev[data.message.sender] || 0) + 1,
        }));
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_status_change", ({ userId, online }) => {});

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_status_change");
    };
  }, [socket, openChat, user]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("user_connected", user.id);
    }
  }, [socket, user]);

  const totalUnreadMessages = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to Chat App
      </h1>

      <p className="text-gray-600 italic text-lg mb-8">
        "The most important thing in communication is hearing what isn't said."
        – Peter Drucker
      </p>

      {/* Chat Button */}
      <button
        onClick={handleOpenChat}
        className="flex items-center gap-2 cursor-pointer px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition fixed bottom-6 right-6"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6" />
          {totalUnreadMessages > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
            </div>
          )}
        </div>
        <span>Open Chat</span>
      </button>

      {/* Render ChatInterface When Open */}
      {openChat && (
        <ChatInterface
          setOpenChat={handleCloseChat}
          unreadMessages={unreadMessages}
          setUnreadMessages={setUnreadMessages}
        />
      )}
    </div>
  );
};

export default Home;
