import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";
import { useGroup } from "../context/GroupContext";
import axios from "axios";
import ChatInterface from "./chat/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { featureItems } from "../constants/featureItem.jsx";

const Home = () => {
  const [openChat, setOpenChat] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [featureHovered, setFeatureHovered] = useState(null);

  const { user, socket, fetchUsers, setUsers } = useAuth();
  const { unreadGroupMessages, setUnreadGroupMessages } = useGroup();
  const { darkMode } = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 },
    },
  };

  useEffect(() => {
    const fetchUnreadmessage = async () => {
      if (!user) return;

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_FRONTEND_URI}/messages/unread`
        );
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
      console.log("enter");
      if (data.message.sender._id !== user.id) {
        setUnreadGroupMessages((prev) => ({
          ...prev,
          [data.message.group]: (prev[data.message.group] || 0) + 1,
        }));
      }
    };

    const handleGroupNotification = (data) => {
      if (data.sender._id !== user.id) {
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
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[calc(80vh-64px)] mt-12 p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
      } transition-colors duration-300`}
    >
      <motion.div
        className="max-w-6xl w-full text-center space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Main Heading */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <motion.h1
            className={`text-4xl md:text-5xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            Welcome to{" "}
            <motion.span
              className="text-blue-500"
              animate={{
                textShadow: [
                  "0 0 8px rgba(59,130,246,0)",
                  "0 0 8px rgba(59,130,246,0.5)",
                  "0 0 8px rgba(59,130,246,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              ChatApp
            </motion.span>
          </motion.h1>
          <motion.div
            className="w-24 h-1.5 bg-blue-500 rounded-full mx-auto"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          ></motion.div>
        </motion.div>

        {/* Quote */}
        <motion.div className="max-w-2xl mx-auto" variants={itemVariants}>
          <motion.p
            className={`text-lg italic ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            "The most important thing in communication is hearing what isn't
            said."
          </motion.p>
          <motion.p
            className={`text-sm not-italic mt-2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            – Peter Drucker
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-12"
          variants={containerVariants}
        >
          {featureItems.map((feature, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-blue-50"
              } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setFeatureHovered(index)}
              onHoverEnd={() => setFeatureHovered(null)}
            >
              <motion.div
                animate={{
                  scale: featureHovered === index ? 1.1 : 1,
                  rotate: featureHovered === index ? 5 : 0,
                }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3
                className={`text-lg font-semibold mt-4 mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
                animate={{
                  color:
                    featureHovered === index
                      ? darkMode
                        ? "#3B82F6"
                        : "#2563EB"
                      : darkMode
                      ? "#FFFFFF"
                      : "#1F2937",
                }}
              >
                {feature.title}
              </motion.h3>
              <motion.p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {feature.desc}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Chat Button */}
      <motion.button
        onClick={handleOpenChat}
        className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium"
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)",
        }}
        whileHover={{
          background: [
            "linear-gradient(to right, #3B82F6, #2563EB)",
            "linear-gradient(to right, #2563EB, #1D4ED8)",
          ],
          scale: 1.05,
          boxShadow: "0 15px 30px rgba(59, 130, 246, 0.7)",
        }}
        whileTap={{ scale: 0.95 }}
        transition={{
          y: { type: "spring", stiffness: 300 },
          background: { duration: 2, repeat: Infinity, repeatType: "reverse" },
        }}
      >
        <div className="relative">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          {totalUnreadMessages > 0 && (
            <motion.div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
              {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
            </motion.div>
          )}
        </div>
        <span>Open Chat</span>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
