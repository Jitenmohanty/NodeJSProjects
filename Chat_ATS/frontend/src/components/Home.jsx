import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import ChatInterface from "./ChatInterface";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";
import { useGroup } from "../context/GroupContext";
import axios from "axios";

const Home = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  
  const { user, socket, fetchUsers, setUsers } = useAuth();
  const { unreadGroupMessages, setUnreadGroupMessages } = useGroup();
  
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchUnreadmessage = async () => {
      if (!user) return;
      
      try {
        const { data } = await axios.get("http://localhost:3000/messages/unread");

        if (data.length > 0) {
          const unreadCount = {};

          data.forEach((msg) => {
            unreadCount[msg.sender] = (unreadCount[msg.sender] || 0) + 1;
          });

          setUnreadMessages(unreadCount);
        } else {
          setUnreadMessages({});
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    
    fetchUnreadmessage();
  }, [user]);

  // Handle socket events for messages and user status
  useEffect(() => {
    if (!socket || !user) return;

    const handleReceiveMessage = (data) => {
      if (!openChat || data.message.sender !== user.id) {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.message.sender]: (prev[data.message.sender] || 0) + 1,
        }));
      }
    };

    const handleGroupMessage = (data) => {
      console.log("enter")
      if ( data.message.sender._id !== user.id) {
        setUnreadGroupMessages((prev) => ({
          ...prev,
          [data.message.group]: (prev[data.message.group] || 0) + 1,
        }));
      }
    };

    const handleGroupNotification = (data) => {
      if ( data.sender._id !== user.id) {
        setUnreadGroupMessages((prev) => ({
          ...prev,
          [data.groupId]: (prev[data.groupId] || 0) + 1,
        }));
      }
    };

    const handleUserStatus = ({ userId, online }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, online } : u))
      );
    };

    const handleUsersStatusUpdate = (users) => {
      setUsers((prev) =>
        prev.map((u) => {
          const updatedUser = users.find((user) => user._id === u._id);
          return updatedUser ? { ...u, online: updatedUser.online } : u;
        })
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("receive_group_message", handleGroupMessage);
    socket.on("group_notification", handleGroupNotification);
    socket.on("user_status_change", handleUserStatus);
    socket.on("users_status_update", handleUsersStatusUpdate);

    // Emit user_connected when socket is ready
    socket.emit("user_connected", user.id);

    return () => {
      socket.emit("user_disconnected", user.id);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("receive_group_message", handleGroupMessage);
      socket.off("group_notification", handleGroupNotification);
      socket.off("user_status_change", handleUserStatus);
      socket.off("users_status_update", handleUsersStatusUpdate);
    };
  }, [socket, openChat, user, setUsers]);

  // Fetch initial users list
  useEffect(() => {
      fetchUsers();
  }, []);

  // Calculate total unread direct messages
  const directMessagesUnread = Object.values(unreadMessages).reduce(
    (sum, count) => sum + count,
    0
  );
  
  // Calculate total unread group messages
  const groupMessagesUnread = Object.values(unreadGroupMessages).reduce(
    (sum, count) => sum + count, 
    0
  );
  
  // Calculate total unread messages (direct + group)
  const totalUnreadMessages = directMessagesUnread + groupMessagesUnread;

  const handleOpenChat = () => {
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
  };

  return (
    <div
      className={`min-h-auto ${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100"
      } transition-colors duration-200 mt-[6vw]`}
    >
      <h1
        className={`text-4xl font-bold ${
          darkMode ? "text-gray-100" : "text-gray-800"
        } mb-4`}
      >
        Welcome to Chat App
      </h1>

      <p className="text-gray-600 italic text-lg mb-8">
        "The most important thing in communication is hearing what isn't said."
        – Peter Drucker
      </p>

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

      {openChat && (
        <ChatInterface
          setOpenChat={handleCloseChat}
          unreadMessages={unreadMessages}
          setUnreadMessages={setUnreadMessages}
          unreadGroupMessages={unreadGroupMessages}
          setUnreadGroupMessages={setUnreadGroupMessages}
          totalUnreadMessages={totalUnreadMessages}
        />
      )}
    </div>
  );
};

export default Home;