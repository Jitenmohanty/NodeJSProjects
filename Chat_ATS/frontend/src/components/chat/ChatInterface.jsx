import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import useSocket from "../../hooks/useSocket";
import { useGroupSocket } from "../../hooks/useGroupSocket";
import { useTheme } from "../../context/ThemeContex";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import CreateGroupModal from "../groupChat/CreateGroupModal";
import Sidebar from "../sidebar/Sidebar";

const ChatInterface = ({
  setOpenChat,
  unreadMessages,
  setUnreadMessages,
  unreadGroupMessages,
  setUnreadGroupMessages,
  totalUnreadMessages
}) => {
  const { user, fetchUsers, users, setUsers } = useAuth();
  const { socket, sendMessage, markMessageAsRead } = useSocket(
    user?.id,
    setUsers
  );
  const {
    socket: groupSocket,
    joinGroup,
    leaveGroup,
    sendGroupMessage,
    markGroupMessageAsRead,
  } = useGroupSocket(user?.id);

  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const processedMessageIdsRef = useRef(new Map());

  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPage, setGroupPage] = useState(1);
  const [groupHasMore, setGroupHasMore] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectBot, setSelectedBot] = useState(null)

  const { darkMode } = useTheme();

  useEffect(() => {
    if (users.length === 0) fetchUsers();
  }, []);

  const showNotification = (sender, text, type = "direct") => {
    if (typeof sender === "object" && sender._id === user.id) return;
    console.log(sender,"sender")
    setNotification({
      sender: typeof sender === "string" ? sender : sender.name || "Unknown",
      text: text?.length > 30 ? text.substring(0, 30) + "..." : text || "New message",
      type,
      timestamp: new Date(),
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data) => {
      const messageId = data.message._id || data.message.tempId;

      if (processedMessageIdsRef.current.has(messageId)) {
        return;
      }

      processedMessageIdsRef.current.set(messageId, "socket");

      if (data.message.sender === selectedUser?._id) {
        setMessages((prev) => [...prev, data.message]);
        markMessageAsRead(data.message._id, data.message.sender);
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
        // Scroll to bottom when receiving a new message in the current chat
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        const senderUser = users.find((u) => u._id === data.message.sender);
        showNotification(
          senderUser?.name || "User",
          data.message.text || "New message"
        );

        setUnreadMessages((prev) => ({
          ...prev,
          [data.message.sender]: (prev[data.message.sender] || 0) + 1,
        }));
      }
    };

    const handleMessageStatus = ({ messageId, status, readAt }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId || msg.tempId === messageId
            ? { ...msg, status, readAt }
            : msg
        )
      );
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_status_update", handleMessageStatus);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_status_update", handleMessageStatus);
    };
  }, [socket, selectedUser, user, users]);

  useEffect(() => {
    if (!groupSocket) return;

    const handleGroupMessage = ({ message }) => {
      const messageId = message._id;
      const tempId = message.tempId;

      if (tempId && messages.some((msg) => msg.tempId === tempId)) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...message, tempId: undefined } : msg
          )
        );
        if (messageId) {
          processedMessageIdsRef.current.set(messageId, "updated");
        }
        return;
      }

      if (messageId && processedMessageIdsRef.current.has(messageId)) {
        return;
      }

      if (message.sender._id === user.id) {
        if (messageId) {
          processedMessageIdsRef.current.set(messageId, "skip-own");
        }
        return;
      }

      processedMessageIdsRef.current.set(messageId, "socket");

      if (selectedGroup && message.group === selectedGroup._id) {
        setMessages((prev) => [...prev, message]);
        markGroupMessageAsRead(message._id, selectedGroup._id);
        // Scroll to bottom when receiving a new message in the current group chat
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        showNotification(message.sender, message.text || "New message", "group");
        setUnreadGroupMessages((prev) => ({
          ...prev,
          [message.group]: (prev[message.group] || 0) + 1,
        }));
      }
    };

    const handleGroupNotification = (data) => {
      const { groupId, sender, text } = data;
      
      if (sender._id === user.id || (selectedGroup && selectedGroup._id === groupId)) {
        return;
      }

      showNotification(sender, text || "New message", "group");
      setUnreadGroupMessages((prev) => ({
        ...prev,
        [groupId]: (prev[groupId] || 0) + 1,
      }));
    };

    const handleGroupUnreadCounts = (counts) => {
      const newUnreadCounts = {};
      counts.forEach(({ groupId, count }) => {
        if (count > 0) {
          newUnreadCounts[groupId] = count;
        }
      });
      setUnreadGroupMessages(newUnreadCounts);
    };

    const handleGroupMessageStatus = ({ messageId, readBy }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId || msg.tempId === messageId ? { ...msg, readBy } : msg
        )
      );
    };

    groupSocket.on("receive_group_message", handleGroupMessage);
    groupSocket.on("group_notification", handleGroupNotification);
    groupSocket.on("group_unread_counts", handleGroupUnreadCounts);
    groupSocket.on("group_message_status_update", handleGroupMessageStatus);

    return () => {
      groupSocket.off("receive_group_message", handleGroupMessage);
      groupSocket.off("group_notification", handleGroupNotification);
      groupSocket.off("group_unread_counts", handleGroupUnreadCounts);
      groupSocket.off("group_message_status_update", handleGroupMessageStatus);
    };
  }, [groupSocket, selectedGroup, user, messages]);

  useEffect(() => {
    if (selectedGroup) {
      setUnreadGroupMessages((prev) => ({
        ...prev,
        [selectedGroup._id]: 0,
      }));
    }
  }, [selectedGroup]);

  const fetchGroupDetails = useCallback(async (groupId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/group-messages/${groupId}/messages`
      );
      setGroupData(response.data);
    } catch (error) {
      console.error("Failed to fetch group details:", error);
    }
  }, []);

  const fetchMessages = useCallback(
    async (isLoadMore = false) => {
      if ((!selectedUser && !selectedGroup) || loading) return;

      setLoading(true);
      if (isLoadMore) {
        setLoadingOlder(true);
      }
      
      try {
        let response;
        const currentPage = isLoadMore ? (selectedUser ? page : groupPage) : 1;
        
        // Store the current scroll height if loading older messages
        let scrollHeight = 0;
        let clientHeight = 0;
        let scrollPosition = 0;
        
        if (isLoadMore && chatContainerRef.current) {
          scrollHeight = chatContainerRef.current.scrollHeight;
          clientHeight = chatContainerRef.current.clientHeight;
          scrollPosition = chatContainerRef.current.scrollTop;
        }

        if (selectedUser) {
          response = await axios.get(
            `${import.meta.env.VITE_FRONTEND_URI}/messages/${selectedUser._id}`,
            {
              params: { page: currentPage, limit: 20 },
            }
          );

          const hasMoreMessages = response.data.length === 20;
          setHasMore(hasMoreMessages);

          response.data.forEach((msg) => {
            processedMessageIdsRef.current.set(msg._id, "api");
          });

          if (isLoadMore) {
            setMessages((prev) => [...response.data, ...prev]);
            setPage(currentPage + 1);
            setIsInitialLoad(false);
          } else {
            setMessages(response.data);
            setPage(2);
            setIsInitialLoad(true);
          }

          response.data.forEach((msg) => {
            if (msg.sender === selectedUser._id && !msg.readAt) {
              markMessageAsRead(msg._id, msg.sender);
            }
          });
        } else if (selectedGroup) {
          response = await axios.get(
            `${import.meta.env.VITE_FRONTEND_URI}/group-messages/${selectedGroup._id}/messages`,
            {
              params: { page: currentPage, limit: 20 },
            }
          );

          const hasMoreMessages = response.data.length === 20;
          setGroupHasMore(hasMoreMessages);

          response.data.forEach((msg) => {
            processedMessageIdsRef.current.set(msg._id, "api");
          });

          if (isLoadMore) {
            setMessages((prev) => [...response.data, ...prev]);
            setGroupPage(currentPage + 1);
            setIsInitialLoad(false);
          } else {
            setMessages(response.data);
            setGroupPage(2);
            setIsInitialLoad(true);
          }

          response.data.forEach((msg) => {
            if (!msg.readBy?.some((read) => read.user === user.id)) {
              markGroupMessageAsRead(msg._id, selectedGroup._id);
            }
          });
        }
        
        // Maintain scroll position when loading older messages
        if (isLoadMore) {
          setTimeout(() => {
            if (chatContainerRef.current) {
              const newScrollHeight = chatContainerRef.current.scrollHeight;
              const heightDifference = newScrollHeight - scrollHeight;
              chatContainerRef.current.scrollTop = scrollPosition + heightDifference;
            }
            setLoadingOlder(false);
          }, 50);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
        if (!isLoadMore) {
          setLoadingOlder(false);
        }
      }
    },
    [
      selectedUser,
      selectedGroup,
      loading,
      user?.id,
      page,
      groupPage,
      markMessageAsRead,
      markGroupMessageAsRead,
    ]
  );

  useEffect(() => {
    if (selectedUser || selectedGroup) {
      setMessages([]);
      setPage(1);
      setGroupPage(1);
      setHasMore(true);
      setGroupHasMore(true);
      setIsInitialLoad(true);
      processedMessageIdsRef.current.clear();

      fetchMessages(false);

      if (selectedUser) {
        setUnreadMessages((prev) => ({
          ...prev,
          [selectedUser._id]: 0,
        }));
      } else if (selectedGroup) {
        joinGroup(selectedGroup._id);
        fetchGroupDetails(selectedGroup._id);

        setUnreadGroupMessages((prev) => ({
          ...prev,
          [selectedGroup._id]: 0,
        }));

        return () => {
          if (selectedGroup) {
            leaveGroup(selectedGroup._id);
          }
        };
      }
    }
  }, [selectedUser?._id, selectedGroup?._id]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    // Load more messages when scrolling to the top
    if (scrollTop === 0 && !loading && !loadingOlder) {
      if ((selectedUser && hasMore) || (selectedGroup && groupHasMore)) {
        fetchMessages(true);
      }
    }
  };

  // Scroll to bottom on initial load or when sending a new message
  useEffect(() => {
    if (isInitialLoad && messagesEndRef.current && !loadingOlder) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isInitialLoad, loadingOlder]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || (!selectedUser && !selectedGroup)) return;

    try {
      const timestamp = new Date().toISOString();

      if (selectedUser) {
        if (user?.blockedUsers?.includes(selectedUser?._id)){
          alert("You cannot send a message to a user you have blocked.");
          return;
        }
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
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        processedMessageIdsRef.current.set(tempId, "local");

        const tempMessage = {
          tempId,
          sender: {
            _id: user.id,
            name: user.name,
          },
          group: selectedGroup._id,
          text: message.trim(),
          timestamp,
          readBy: [{ user: user.id }],
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendGroupMessage(selectedGroup._id, message.trim(), null, tempId);
      }

      setMessage("");
      // Scroll to bottom when sending a message
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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
        `${import.meta.env.VITE_FRONTEND_URI}/upload/file`,
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
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        processedMessageIdsRef.current.set(tempId, "local");

        const tempMessage = {
          tempId,
          sender: {
            _id: user.id,
            name: user.name,
          },
          group: selectedGroup._id,
          ...fileData,
          timestamp,
          readBy: [{ user: user.id }],
        };

        setMessages((prev) => [...prev, tempMessage]);
        sendGroupMessage(selectedGroup._id, "", fileData, tempId);
      }
      
      // Scroll to bottom when sending a file
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Failed to upload file:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

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
    setGroupData(null);
  };

  return (
    <div className={`fixed inset-0 flex`}>
      <Sidebar setSelectedBot={setSelectedBot} setSelectedUser={setSelectedUser} setSelectedGroup={setSelectedGroup} totalUnreadMessages={totalUnreadMessages}/>
      <ChatList
        users={users}
        setSelectedUser={setSelectedUser}
        setSelectedGroup={setSelectedGroup}
        setSelectedBot={setSelectedBot}
        unreadMessages={unreadMessages}
        unreadGroupMessages={unreadGroupMessages}
        openGroupModal={openGroupModal}
        darkMode={darkMode}
      />
      <ChatWindow
        selectedUser={selectedUser}
        selectBot={selectBot}
        setSelectedUser={setSelectedUser}
        setOpenChat={setOpenChat}
        selectedGroup={selectedGroup}
        resetSelection={resetSelection}
        messages={messages}
        loading={loading}
        loadingOlder={loadingOlder}
        user={user}
        messagesEndRef={messagesEndRef}
        chatContainerRef={chatContainerRef}
        groupData={groupData}
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleFileUpload={handleFileUpload}
        uploading={uploading}
        notification={notification}
        darkMode={darkMode}
        handleScroll={handleScroll}
        hasMore={hasMore}
        groupHasMore={groupHasMore}
      />
      <CreateGroupModal isOpen={isGroupModalOpen} onClose={closeGroupModal} />
    </div>
  );
};

export default ChatInterface;