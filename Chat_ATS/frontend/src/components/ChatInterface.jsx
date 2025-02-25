import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const { socket: groupSocket, joinGroup, leaveGroup, sendGroupMessage, markGroupMessageAsRead } = useGroupSocket(user?.id);
  
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
  const [groupData, setGroupData] = useState(null);

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
      console.log("Received direct message:", data);
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
      console.log("Message status update:", messageId, status);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status, readAt } : msg
        )
      );
    };

    const handleUserStatus = ({ userId, online }) => {
      console.log("User status change:", userId, online);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, online } : u))
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_status_update", handleMessageStatus);
    socket.on("user_status_change", handleUserStatus);
    socket.on("users_status_update", (users) => {
      console.log("Users status update received");
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
    if (!groupSocket) return;

    const handleReceiveGroupMessage = ({ message }) => {
      console.log("Received group message:", message);
      if (selectedGroup && message.group === selectedGroup._id) {
        setMessages((prev) => [...prev, message]);
        markGroupMessageAsRead(message._id, selectedGroup._id);
      } else if (message.group) {
        // Increment unread count for this group
        setUnreadMessages((prev) => ({
          ...prev,
          [`group_${message.group}`]: (prev[`group_${message.group}`] || 0) + 1,
        }));
      }
    };

    const handleGroupMessageStatus = ({ messageId, readBy }) => {
      console.log("Group message status update:", messageId, readBy);
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

  // Fetch group details when a group is selected
  const fetchGroupDetails = useCallback(async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:3000/groups/${groupId}/messages`);
      setGroupData(response.data);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
    }
  }, []);

  // Fetch direct messages or group messages
  const fetchMessages = useCallback(async (isLoadMore = false) => {
    if ((!selectedUser && !selectedGroup) || loading) return;
    
    setLoading(true);
    console.log("Fetching messages for", selectedUser ? "user" : "group");

    try {
      let response;
      // Use the current page state inside the function rather than from deps
      const currentPage = isLoadMore ? (selectedUser ? page : groupPage) : 1;
      
      if (selectedUser) {
        response = await axios.get(
          `http://localhost:3000/messages/${selectedUser._id}`,
          {
            params: { page: currentPage, limit: 20 },
          }
        );

        const hasMoreMessages = response.data.length === 20;
        setHasMore(hasMoreMessages);
        
        if (isLoadMore) {
          setMessages((prev) => [...response.data, ...prev]);
          setPage(currentPage + 1);
        } else {
          setMessages(response.data);
          setPage(2); // Start at 2 for next load
        }

        // Mark messages as read
        response.data.forEach((msg) => {
          if (msg.sender === selectedUser._id && !msg.readAt) {
            markMessageAsRead(msg._id, msg.sender);
          }
        });
      } else if (selectedGroup) {
        response = await axios.get(
          `http://localhost:3000/groups/${selectedGroup._id}/messages`,
          {
            params: { page: currentPage, limit: 20 },
          }
        );

        const hasMoreMessages = response.data.length === 20;
        setGroupHasMore(hasMoreMessages);
        
        if (isLoadMore) {
          setMessages((prev) => [...response.data, ...prev]);
          setGroupPage(currentPage + 1);
        } else {
          setMessages(response.data);
          setGroupPage(2); // Start at 2 for next load
        }
        
        // Mark group messages as read
        response.data.forEach((msg) => {
          if (!msg.readBy?.some(read => read.user === user.id)) {
            markGroupMessageAsRead(msg._id, selectedGroup._id);
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser, selectedGroup, loading, user?.id, markMessageAsRead, markGroupMessageAsRead]);

  // Initial message load when selected user/group changes
  useEffect(() => {
    if (selectedUser || selectedGroup) {
      // Reset state for new selection
      setMessages([]);
      setPage(1);
      setGroupPage(1);
      setHasMore(true);
      setGroupHasMore(true);
      setScrollTop(false);
      
      // Initial load (not "load more")
      fetchMessages(false);
      
      // Clear unread messages
      if (selectedUser) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
      } else if (selectedGroup) {
        // Join group and fetch details
        joinGroup(selectedGroup._id);
        fetchGroupDetails(selectedGroup._id);
        
        setUnreadMessages((prev) => ({
          ...prev,
          [`group_${selectedGroup._id}`]: 0,
        }));
        
        // Return cleanup function
        return () => {
          leaveGroup(selectedGroup._id);
        };
      }
    }
  }, [selectedUser?._id, selectedGroup?._id]); // Only depend on IDs, not the full objects

  // Load more messages when scrolling to the top
  const handleScroll = (event) => {
    if (event.target.scrollTop === 0 && !loading) {
      if ((selectedUser && hasMore) || (selectedGroup && groupHasMore)) {
        setScrollTop(true);
        fetchMessages(true); // Pass true to indicate "load more"
      }
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!scrollTop && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setScrollTop(false);
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      const timestamp = new Date().toISOString();
      
      if (selectedUser) {
        // Send direct message
        const tempMessage = {
          sender: user.id,
          receiver: selectedUser._id,
          text: message.trim(),
          timestamp,
          status: "sent",
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendMessage(selectedUser._id, message.trim());
      } else if (selectedGroup) {
        // Send group message
        const tempMessage = {
          sender: {
            _id: user.id,
            name: user.name
          },
          group: selectedGroup._id,
          text: message.trim(),
          timestamp,
          readBy: [{ user: user.id }],
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

      const timestamp = new Date().toISOString();

      if (selectedUser) {
        // Send file in direct message
        const tempMessage = {
          sender: user.id,
          receiver: selectedUser._id,
          ...fileData,
          timestamp,
          status: "sent",
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendMessage(selectedUser._id, "", fileData);
      } else if (selectedGroup) {
        // Send file in group message
        const tempMessage = {
          sender: {
            _id: user.id,
            name: user.name
          },
          group: selectedGroup._id,
          ...fileData,
          timestamp,
          readBy: [{ user: user.id }],
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
          _id: "ai-welcome",
          sender: "AI",
          receiver: user.id,
          text: "How can I help you?",
          timestamp: new Date().toISOString(),
          status: "sent",
        },
      ]);
    }
  }, [selectAi, user?.id]);

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const resetSelection = () => {
    if (selectedGroup) {
      leaveGroup(selectedGroup._id);
    }
    setSelectedUser(null);
    setSelectedGroup(null);
    setSelectAi(false);
    setGroupData(null);
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
                  groupMembers={groupData?.members || []}
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