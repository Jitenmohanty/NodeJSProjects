import { Check, FileIcon, FileText, Image as ImageIcon } from "lucide-react";

const ChatWindow = ({ messages, loading, user, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const MessageStatus = ({ status, readAt }) => {
    if (status === "sent") {
      return <Check className="h-3 w-3 text-gray-400" />;
    } else if (status === "delivered") {
      return (
        <div className="flex">
          <Check className="h-3 w-3 text-gray-400" />
          <Check className="h-3 w-3 -ml-1 text-gray-400" />
        </div>
      );
    } else if (readAt) {
      return (
        <div className="flex">
          <Check className="h-3 w-3 text-blue-500" />
          <Check className="h-3 w-3 -ml-1 text-blue-500" />
        </div>
      );
    }
    return null;
  };

  const FilePreview = ({ fileUrl, fileName, fileType }) => {
    if (fileType.startsWith("image/")) {
      // 🖼 Image Preview
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
    } else if (fileType.includes("pdf")) {
      // 📄 PDF Preview
      return (
        <div className="bg-gray-100 p-2 rounded-lg flex flex-col items-center">
          <FileText className="w-8 h-8 text-red-500" />
          <p className="text-sm truncate max-w-[150px]">{fileName}</p>
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
      // 📂 Other Files
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
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.sender === user.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === user.id
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text && <p className="text-sm mb-2">{msg.text}</p>}

                {/* Show File Preview */}
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
                  <p className={`text-xs ${msg.sender === user.id ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                  {msg.sender === user.id && <MessageStatus status={msg.status} readAt={msg.readAt} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
