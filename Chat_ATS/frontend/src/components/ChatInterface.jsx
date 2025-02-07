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
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/${selectedUser._id}`
        );
        setMessages(response.data);
        response.data.forEach((msg) => {
          if (msg.sender === selectedUser._id && !msg.readAt) {
            markMessageAsRead(msg._id, msg.sender);
          }
        });
      } catch (error) {
        alert("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (data) => {
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
    });

    socket.on("message_status_update", ({ messageId, status, readAt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status, readAt } : msg
        )
      );
    });

    socket.on("user_status_change", ({ userId, online }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, online } : u))
      );
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_status_update");
      socket.off("user_status_change");
    };
  }, [socket, selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        _id: Date.now(),
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
      alert("Failed to send message");
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
        _id: Date.now(),
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
      alert("Failed to upload file");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Chat Header */}
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenChat={setOpenChat}
        />

        {/* Chat Content */}
        <div className="h-[500px] flex flex-col">
          {!selectedUser ? (
            <UserList
              users={users}
              setSelectedUser={setSelectedUser}
              unreadMessages={unreadMessages}
            />
          ) : (
            <>
              <ChatWindow
                messages={messages}
                loading={loading}
                user={user}
                messagesEndRef={messagesEndRef}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />

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
