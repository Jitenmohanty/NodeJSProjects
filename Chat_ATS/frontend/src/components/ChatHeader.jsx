import { X, ArrowLeft } from 'lucide-react';

const ChatHeader = ({ selectedUser, setSelectedUser, setOpenChat }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between">
      {/* Back Button */}
      {selectedUser ? (
        <button onClick={() => setSelectedUser(null)} className="text-white hover:text-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-5"></div> // Placeholder to keep spacing
      )}

      {/* User Info */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white">{selectedUser ? selectedUser.name : "Chat"}</h2>
        {selectedUser && (
          <p className={`text-sm ${selectedUser.online ? "text-[#f3ef08]" : "text-gray-200"}`}>
            {selectedUser.online ? "Online" : "Offline"}
          </p>
        )}
      </div>

      {/* Close Chat Button */}
      <button onClick={() => setOpenChat(false)} className="text-white hover:text-gray-200">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
