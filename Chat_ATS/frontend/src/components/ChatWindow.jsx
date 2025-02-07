import { Check, FileIcon, FileText } from 'lucide-react';

const ChatWindow = ({ messages, loading, user, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const MessageStatus = ({ status, readAt }) => {
    if (status === 'sent') {
      return <Check className="h-3 w-3 text-gray-400" />;
    } else if (status === 'delivered') {
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

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => (
            <div key={msg._id} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === user.id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {msg.text && <p className="text-sm mb-2">{msg.text}</p>}
                {msg.fileUrl && (
                  <div className="mb-2">
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="w-8 h-8 text-red-500" />
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className={`text-xs ${msg.sender === user.id ? 'text-blue-100' : 'text-gray-500'}`}>
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
