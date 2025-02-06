import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "./ChatHeader";
import ChatWindow from "./ChatWindow";
import UserList from "./UserList";
import MessageInput from "./MessageInput";

// Chat Interface Component
const ChatInterface = ({ setOpenChat, unreadMessages, setUnreadMessages }) => {
  const { user, fetchUsers, users, setUsers, socket } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (user) {
      socket.emit("user_connected", user.id);
    }

    const handleStatusChange = ({ userId, online }) => {
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, online } : u))
      );
    };

    const handleReceiveMessage = (data) => {
      if (data.message.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, data.message]);
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

    socket.on("user_status_change", handleStatusChange);
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("user_status_change", handleStatusChange);
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, user, selectedUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/${selectedUser._id}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

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
    if (!message.trim() || !selectedUser || !socket) return;

    try {
      socket.emit("send_message", {
        senderId: user.id,
        receiverId: selectedUser._id,
        text: message.trim(),
      });

      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now(),
          sender: user.id,
          receiver: selectedUser._id,
          text: message.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="fixed bottom-6 top-0.5 right-6 w-80 sm:w-96">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenChat={setOpenChat}
        />
        <div className="h-[500px] flex flex-col">
          {!selectedUser ? (
            <UserList
              users={users}
              setSelectedUser={setSelectedUser}
              unreadMessages={unreadMessages}
            />
          ) : (
            <ChatWindow
              messages={messages}
              loading={loading}
              messagesEndRef={messagesEndRef}
              user={user}
            />
          )}
        </div>
        {selectedUser && (
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
          />
        )}
      </div>
    </div>
  );
};


export default ChatInterface;
