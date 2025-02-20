import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import useSocket from "../hooks/useSocket";
import { useGroupSocket } from "../hooks/useGroupSocket";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import UserList from "./UserList";
import { useTheme } from "../context/ThemeContex";
import GroupList from "./GroupList";
import CreateGroupModal from "./CreateGroupModal";
import UnifiedChatWindow from "./UnifiedChatWindow";

const ChatInterface = ({ setOpenChat, unreadMessages, setUnreadMessages }) => {
  const { user, fetchUsers, users, setUsers } = useAuth();
  const { socket, sendMessage, markMessageAsRead } = useSocket(
    user?.id,
    setUsers
  );
  const { socket: groupSocket, sendGroupMessage, markGroupMessageAsRead } = useGroupSocket(user?.id);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const messagesEndRef = useRef(null);

  // Group chat state
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);

  const { darkMode } = useTheme();
  const [selectAi, setSelectAi] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);

  // Handle direct message socket events
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

  // Handle group message socket events
  useEffect(() => {
    if (!groupSocket || !selectedGroup) return;

    const handleReceiveGroupMessage = ({ message }) => {
      setMessages((prev) => [...prev, message]);
      markGroupMessageAsRead(message._id, selectedGroup._id);
    };

    const handleGroupMessageStatus = ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, readBy } : msg))
      );
    };

    groupSocket.on("receive_group_message", handleReceiveGroupMessage);
    groupSocket.on("group_message_status_update", handleGroupMessageStatus);

    return () => {
      groupSocket.off("receive_group_message", handleReceiveGroupMessage);
      groupSocket.off("group_message_status_update", handleGroupMessageStatus);
    };
  }, [groupSocket, selectedGroup]);

  // Fetch direct messages
  const fetchMessages = async () => {
    if ((!selectedUser && !selectedGroup) || !hasMore || loading) return;
    setLoading(true);

    try {
      let response;
      if (selectedUser) {
        response = await axios.get(
          `http://localhost:3000/messages/${selectedUser._id}`,
          {
            params: { page, limit: 20 },
          }
        );

        if (response.data.length < 20) setHasMore(false);
        setMessages((prev) => [...response.data, ...prev]);
        setPage((prev) => prev + 1);

        response.data.forEach((msg) => {
          if (msg.sender === selectedUser._id && !msg.readAt) {
            markMessageAsRead(msg._id, msg.sender);
          }
        });
      } else if (selectedGroup) {
        response = await axios.get(
          `http://localhost:3000/groups/${selectedGroup._id}/messages`,
          {
            params: { page: groupPage, limit: 20 },
          }
        );

        if (response.data.length < 20) setGroupHasMore(false);
        setMessages((prev) => [...response.data, ...prev]);
        setGroupPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset messages when selected user or group changes
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setGroupPage(1);
    setHasMore(true);
    setGroupHasMore(true);
    
    if (selectedUser || selectedGroup) {
      fetchMessages();
    }
    
    // Clear unread messages for the selected contact
    if (selectedUser) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
    } else if (selectedGroup) {
      setUnreadMessages((prev) => ({
        ...prev,
        [`group_${selectedGroup._id}`]: 0,
      }));
    }
  }, [selectedUser, selectedGroup]);

  // Load more messages when scrolling to the top
  const handleScroll = (event) => {
    if (event.target.scrollTop === 0 && !loading) {
      setScrollTop(true);
      if (selectedUser && hasMore) {
        fetchMessages();
      } else if (selectedGroup && groupHasMore) {
        fetchMessages();
      }
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!scrollTop)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      if (selectedUser) {
        // Send direct message
        const tempMessage = {
          sender: user.id,
          receiver: selectedUser._id,
          text: message.trim(),
          timestamp: new Date().toISOString(),
          status: "sent",
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendMessage(selectedUser._id, message.trim());
      } else if (selectedGroup) {
        // Send group message
        const tempMessage = {
          sender: user.id,
          text: message.trim(),
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendGroupMessage(selectedGroup._id, message.trim());
      }
      
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleFileUpload = async (e) => {
    if (!selectedUser && !selectedGroup) return;
    
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

      const fileData = {
        fileUrl: response.data.fileUrl,
        fileName: response.data.fileName,
        fileType: response.data.fileType,
      };

      if (selectedUser) {
        // Send file in direct message
        const tempMessage = {
          sender: user.id,
          receiver: selectedUser._id,
          ...fileData,
          timestamp: new Date().toISOString(),
          status: "sent",
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendMessage(selectedUser._id, "", fileData);
      } else if (selectedGroup) {
        // Send file in group message
        const tempMessage = {
          sender: user.id,
          ...fileData,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendGroupMessage(selectedGroup._id, "", fileData);
      }
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

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const resetSelection = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectAi(false);
  };

  return (
    <div className="fixed bottom-2 right-6 w-80 sm:w-96">
      <div
        className={`${
          darkMode ? "bg-gray-900" : "bg-white"
        } rounded-lg shadow-xl overflow-hidden`}
      >
        <ChatHeader
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setOpenChat={setOpenChat}
          group={selectedGroup}
          onBack={resetSelection}
        />

        <div className="h-[500px] flex flex-col">
          {!selectedUser && !selectedGroup && !selectAi ? (
            <>
              <UserList
                users={users}
                setSelectedUser={setSelectedUser}
                unreadMessages={unreadMessages}
                setSelectAi={setSelectAi}
              />
              <GroupList
                setSelectedGroup={setSelectedGroup}
                unreadMessages={unreadMessages}
              />
              <button
                onClick={openGroupModal}
                className="w-full p-2 text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Create New Group
              </button>
            </>
          ) : (
            <>
              {/* Unified Chat Window */}
              <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
                <UnifiedChatWindow 
                  messages={messages}
                  loading={loading}
                  user={user}
                  messagesEndRef={messagesEndRef}
                  scrollTop={scrollTop}
                  isGroup={!!selectedGroup}
                  groupMembers={selectedGroup?.members || []}
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

      <CreateGroupModal isOpen={isGroupModalOpen} onClose={closeGroupModal} />
    </div>
  );
};

export default ChatInterface;