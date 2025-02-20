import { X, ArrowLeft, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContex';

const ChatHeader = ({ selectedUser, setSelectedUser, setOpenChat, group, onBack }) => {
  const { darkMode } = useTheme();
  
  // Handle back button functionality
  const handleBack = () => {
    if (onBack) {
      onBack(); // Use unified back handler if provided
    } else {
      setSelectedUser(null); // Fallback to old method
    }
  };
  
  // Determine which entity is selected (user or group)
  const isChat = selectedUser || group;
  
  // Get name and status based on what's selected
  const getName = () => {
    if (group) return group.name;
    if (selectedUser) return selectedUser.name;
    return "Chat";
  };
  
  return (
    <div className={`p-4 flex items-center justify-between ${
      darkMode 
        ? "bg-gradient-to-r from-blue-700 to-blue-800" 
        : "bg-gradient-to-r from-blue-500 to-blue-600"
    }`}>
      {/* Back Button */}
      {isChat ? (
        <button onClick={handleBack} className="text-white hover:text-gray-200">
          <ArrowLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-5"></div> // Placeholder to keep spacing
      )}

      {/* User/Group Info */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-white">{getName()}</h2>
        
        {selectedUser && (
          <p className={`text-sm ${selectedUser.online ? "text-[#f3ef08]" : "text-gray-200"}`}>
            {selectedUser.online ? "Online" : "Offline"}
          </p>
        )}
        
        {group && (
          <div className="flex items-center text-sm text-gray-200">
            <Users className="w-3 h-3 mr-1" />
            <span>{group.members?.length || 0} members</span>
          </div>
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