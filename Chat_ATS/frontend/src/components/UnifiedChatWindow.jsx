import React, { useEffect, useState } from "react";
import { Check, FileIcon, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const UnifiedChatWindow = ({
  messages,
  loading,
  loadingOlder,
  user,
  isGroup = false,
  groupMembers = [],
  messagesEndRef,
  chatContainerRef,
  selectedUser,
}) => {
  const [processedMessages, setProcessedMessages] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const {UnblockUser} = useAuth();

  useEffect(() => {
    const checkIfUserIsBlocked = () => {
      if (user?.blockedUsers?.includes(selectedUser._id)) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    };
    if (!isGroup) {
      checkIfUserIsBlocked();
    }
  }, [user, selectedUser]); // Re-run when user or selectedUser changes


  const handleUnBlockUser = async (id) => {
    await UnblockUser(id);
  };

  // Process messages to ensure consistent format
  useEffect(() => {
    if (!messages || !user) return;

    const processed = messages.map((msg) => {
      const isUserMessage = determineIfUserMessage(msg, user);
      return {
        ...msg,
        isUserMessage,
      };
    });

    setProcessedMessages(processed);
  }, [messages, user]);

  // Determine if a message is from the current user
  const determineIfUserMessage = (msg, currentUser) => {
    if (!msg || !currentUser) return false;

    const senderId = msg.sender;
    const userId = currentUser.id || currentUser._id;

    if (typeof senderId === "object" && senderId !== null) {
      return senderId._id === userId || senderId.id === userId;
    }

    return senderId === userId;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MessageStatus = ({ status, readAt, readBy }) => {
    if (isGroup && readBy) {
      const readCount = readBy?.length || 0;
      return readCount > 0 ? (
        <span className="text-xs text-gray-400">{readCount} read</span>
      ) : null;
    }

    if (status === "sent") {
      return <Check className="h-3 w-3 text-gray-400" />;
    } else if (status === "delivered") {
      return (
        <div className="flex">
          <Check className="h-3 w-3 text-gray-200" />
          <Check className="h-3 w-3 -ml-2 mt-0.5 text-gray-200" />
        </div>
      );
    } else if (status === "read") {
      return (
        <div className="flex">
          <Check className="h-3 w-3 text-blue-300" />
          <Check className="h-3 w-3 -ml-1 text-blue-300" />
        </div>
      );
    }
    return null;
  };

  const getSenderName = (sender) => {
    if (!isGroup) return null;

    if (sender && typeof sender === "object" && sender.name) {
      return sender.name;
    }

    const member = groupMembers.find(
      (m) => m._id === sender || m.id === sender
    );
    if (member && member.name) {
      return member.name;
    }

    return "Unknown user";
  };

  const FilePreview = ({ fileUrl, fileName, fileType }) => {
    if (!fileUrl) return null;

    if (fileType?.startsWith("image/")) {
      return (
        <div className="relative group">
          <img
            src={fileUrl}
            alt={fileName || "Image"}
            className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer"
            onClick={() => window.open(fileUrl, "_blank")}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
            {fileName || "Image"}
          </div>
        </div>
      );
    } else if (fileType?.includes("pdf")) {
      return (
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FileText className="w-8 h-8 text-red-500" />
          <p className="text-sm truncate max-w-[150px] text-gray-800 dark:text-gray-200">
            {fileName || "PDF Document"}
          </p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-blue-500 underline text-xs"
          >
            View PDF
          </a>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 cursor-pointer hover:bg-opacity-80">
          <FileIcon className="w-8 h-8 text-blue-500" />
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm truncate max-w-[150px] text-blue-500 underline"
          >
            {fileName || "File"}
          </a>
        </div>
      );
    }
  };

  const renderDateSeparator = (currMsg, prevMsg) => {
    if (!currMsg || !prevMsg) return null;

    const currDate = new Date(
      currMsg.timestamp || currMsg.createdAt
    ).toLocaleDateString();
    const prevDate = new Date(
      prevMsg.timestamp || prevMsg.createdAt
    ).toLocaleDateString();

    if (currDate !== prevDate) {
      return (
        <div className="flex justify-center my-3">
          <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-xs text-gray-600 dark:text-gray-300">
            {currDate}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
      {loading && !loadingOlder ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {loadingOlder && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}

          {processedMessages.map((msg, index) => {
            if (!msg) return null;

            const prevMsg = index > 0 ? processedMessages[index - 1] : null;

            return (
              <div key={msg._id || msg.tempId || `msg-${index}`}>
                {renderDateSeparator(msg, prevMsg)}

                <div
                  className={`flex ${
                    msg.isUserMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[75%] ${
                      msg.isUserMessage
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {isGroup && !msg.isUserMessage && (
                      <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                        {getSenderName(msg.sender)}
                      </p>
                    )}

                    {msg.fileUrl && (
                      <div className="mb-2">
                        <FilePreview
                          fileUrl={msg.fileUrl}
                          fileName={msg.fileName}
                          fileType={msg.fileType}
                        />
                      </div>
                    )}

                    <div className="flex items-end gap-1">
                      {msg.text && (
                        <p className="text-sm mr-2 break-words">{msg.text}</p>
                      )}

                      <div className="flex items-center ml-1 whitespace-nowrap self-end">
                        <span
                          className={`text-xs ${
                            msg.isUserMessage
                              ? "text-gray-300"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(
                            msg.timestamp || msg.createdAt || new Date()
                          )}
                        </span>

                        {msg.isUserMessage && (
                          <div className="ml-1">
                            <MessageStatus
                              status={msg.status}
                              readAt={msg.readAt}
                              readBy={msg.readBy}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
          {isBlocked && !isGroup && (
            <div className="flex justify-center">
              <div className="bg-gray-700 w-[30%] text-gray-100 border border-gray-400 px-3 py-1 rounded-full flex justify-center items-center gap-2 shadow-sm">
                <span className="text-sm font-medium">
                  🚫 User Blocked by you
                </span>
                <button
                  onClick={()=>handleUnBlockUser(selectedUser?._id)}
                  className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs hover:bg-gray-600 transition cursor-pointer"
                >
                  Unblock
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedChatWindow;
