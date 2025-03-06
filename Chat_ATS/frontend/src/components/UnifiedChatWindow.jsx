import React from "react";
import { Check, FileIcon, FileText } from "lucide-react";
import { useTheme } from "../context/ThemeContex";

const UnifiedChatWindow = ({
  messages,
  loading,
  user,
  messagesEndRef,
  scrollTop,
  isGroup = false,
  groupMembers = [],
}) => {
  const { darkMode } = useTheme();

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MessageStatus = ({ status, readAt, readBy }) => {
    if (isGroup && readBy) {
      // For group messages, show read count
      const readCount = readBy?.length || 0;
      return readCount > 0 ? (
        <span className="text-xs text-gray-400">{readCount} read</span>
      ) : null;
    }

    // For direct messages
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
          <Check className="h-3 w-3 text-gray-800" />
          <Check className="h-3 w-3 -ml-1 text-gray-800" />
        </div>
      );
    }
    return null;
  };

  const getSenderName = (sender) => {
    if (!isGroup) return null;
    
    // Handle populated sender object
    if (sender && typeof sender === 'object' && sender.name) {
      return sender.name;
    }
    
    // Handle sender ID (would need to lookup in groupMembers)
    const member = groupMembers.find(m => m._id === sender || m.id === sender);
    if (member && member.name) {
      return member.name;
    }
    
    return "Unknown user";
  };

  const isUserMessageFn = (msg) => {
    const senderId = msg.sender;
    
    // Handle populated sender object vs ID
    if (typeof senderId === 'object' && senderId !== null) {
      return senderId._id === user.id;
    }
    
    return senderId === user.id;
  };

  const FilePreview = ({ fileUrl, fileName, fileType }) => {
    if (fileType?.startsWith("image/")) {
      return (
        <div className="relative group">
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-[200px] max-h-[200px] rounded-lg cursor-pointer"
            onClick={() => window.open(fileUrl, "_blank")}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
            {fileName}
          </div>
        </div>
      );
    } else if (fileType?.includes("pdf")) {
      return (
        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col items-center">
          <FileText className="w-8 h-8 text-red-500" />
          <p className="text-sm truncate max-w-[150px] text-gray-800 dark:text-gray-200">
            {fileName}
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
            {fileName}
          </a>
        </div>
      );
    }
  };

  return (
    <div
      className={`flex-1 overflow-y-auto p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, index) => {
            if (!msg) return null; // Guard against undefined messages
            
            const isUserMessage = isUserMessageFn(msg);
            const senderName = isGroup && !isUserMessage ? getSenderName(msg.sender) : null;

            return (
              <div
                key={msg._id || `msg-${index}`}
                className={`flex ${
                  isUserMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isUserMessage
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                  }`}
                >
                  {isGroup && !isUserMessage && (
                    <p className="text-xs font-medium mb-1 text-gray-500 dark:text-gray-400">
                      {senderName}
                    </p>
                  )}

                  {msg.text && <p className="text-sm mb-2">{msg.text}</p>}

                  {msg.fileUrl && (
                    <div className="mb-2">
                      <FilePreview
                        fileUrl={msg.fileUrl}
                        fileName={msg.fileName}
                        fileType={msg.fileType}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p
                      className={`text-xs ${
                        isUserMessage
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp || msg.createdAt || new Date())}
                    </p>
                    {isUserMessage && (
                      <MessageStatus
                        status={msg.status}
                        readAt={msg.readAt}
                        readBy={msg.readBy}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default UnifiedChatWindow;