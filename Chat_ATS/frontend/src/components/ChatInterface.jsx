import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import UserList from "./UserList";

const ChatInterface = ({ setOpenChat, unreadMessages, setUnreadMessages }) => {
  const { user, fetchUsers, users, setUsers } = useAuth();
  const { socket, sendMessage, markMessageAsRead } = useSocket(user?.id);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  const [selectAi, setSelectAi] = useState(false);
  // console.log(selectAi)

  // Fetch users on mount
  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      if (data.message.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, data.message]);
        markMessageAsRead(data.message._id, data.message.sender);
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
      } else {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.message.sender]: (prev[data.message.sender] || 0) + 1,
        }));
      }
    };

    const handleMessageStatus = ({ messageId, status, readAt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status, readAt } : msg
        )
      );
    };

    const handleUserStatus = ({ userId, online }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, online } : u))
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_status_update", handleMessageStatus);
    socket.on("user_status_change", handleUserStatus);
    socket.on("users_status_update", (users) => {
      setUsers((prev) =>
        prev.map((u) => {
          const updatedUser = users.find((user) => user._id === u._id);
          return updatedUser ? { ...u, online: updatedUser.online } : u;
        })
      );
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_status_update", handleMessageStatus);
      socket.off("user_status_change", handleUserStatus);
      socket.off("users_status_update");
    };
  }, [socket, selectedUser, user]);

  const fetchMessages = async () => {
    if (!selectedUser || !hasMore) return; // Stop if no more messages to load
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3000/messages/${selectedUser._id}`,
        {
          params: { page, limit: 20 }, // Request paginated messages
        }
      );

      if (response.data.length < 20) setHasMore(false); // No more messages to load

      setMessages((prev) => [...response.data, ...prev]); // Append older messages at the top
      setPage((prev) => prev + 1); // Increase page number for next fetch

      // Mark messages as read if they are unread and from the selected user
      response.data.forEach((msg) => {
        if (msg.sender === selectedUser._id && !msg.readAt) {
          markMessageAsRead(msg._id, msg.sender);
        }
      });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset messages when the selected user changes
  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      fetchMessages(); // Fetch initial messages
    }
  }, [selectedUser]);

  // Load more messages when scrolling to the top
  const handleScroll = (event) => {
    if (event.target.scrollTop === 0 && hasMore && !loading) {
      fetchMessages(); // Fetch more messages
    }
  };


  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear unread messages when selecting a user
  useEffect(() => {
    if (selectedUser) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;

    try {
      const tempMessage = {
        sender: user.id,
        receiver: selectedUser._id,
        text: message.trim(),
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, tempMessage]);
      setMessage("");

      sendMessage(selectedUser._id, message.trim());
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const tempMessage = {
        sender: user.id,
        receiver: selectedUser._id,
        fileUrl: response.data.fileUrl,
        fileName: response.data.fileName,
        fileType: response.data.fileType,
        timestamp: new Date().toISOString(),
        status: "sent",
      };

      setMessages((prev) => [...prev, tempMessage]);

      sendMessage(selectedUser._id, "", {
        fileUrl: response.data.fileUrl,
        fileName: response.data.fileName,
        fileType: response.data.fileType,
      });
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Handle AI Chat Selection
  useEffect(() => {
    if (selectAi) {
      setMessages([
        {
          _id: 233,
          sender: "AI",
          receiver: user.id,
          text: "How can I help you?",
          timestamp: new Date().toISOString(),
          status: "sent",
        },
      ]);
    }
  }, [selectAi]);

  return (
    <div className="fixed bottom-2 right-6 w-80 sm:w-96">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenChat={setOpenChat}
        />

        <div className="h-[500px] flex flex-col">
          {!selectedUser && !selectAi ? (
            <UserList
              users={users}
              setSelectedUser={setSelectedUser}
              unreadMessages={unreadMessages}
              setSelectAi={setSelectAi}
            />
          ) : (
            <>
              {/* Chat Messages Window */}
              <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                <ChatWindow
                  messages={messages}
                  loading={loading}
                  user={user}
                  messagesEndRef={messagesEndRef}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                />
              </div>

              {/* Message Input Box */}
              <MessageInput
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                handleFileUpload={handleFileUpload}
                uploading={uploading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
