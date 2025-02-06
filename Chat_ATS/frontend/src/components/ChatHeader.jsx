import { X } from "lucide-react";

// Chat Header Component
const ChatHeader = ({ selectedUser, setSelectedUser, setOpenChat }) => (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center">
      <div className="flex flex-col">
        <h2 className="text-xl font-bold text-white">
          {selectedUser ? selectedUser.name : "Select a User"}
        </h2>
        {selectedUser && (
          <p className={`text-sm ${selectedUser.online ? "text-[#f3ef08]" : "text-gray-200"}`}>
            {selectedUser.online ? "Online" : "Offline"}
          </p>
        )}
      </div>
      <button
        onClick={() => (selectedUser ? setSelectedUser(null) : setOpenChat(false))}
        className="text-white hover:text-gray-200 transition-colors cursor-pointer"
      >
        <X />
      </button>
    </div>
  );

  export default ChatHeader