import React, { useCallback, useState } from "react";
import {
  MessageSquare,
  GroupIcon,
  User,
  Settings,
  LogOut,
  BotMessageSquare,
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingModal";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ totalUnreadMessages,setSelectedBot,setSelectedGroup,setSelectedUser }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { logout, user } = useAuth();


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const handleChatBot = useCallback(() => {
    setSelectedGroup(null);
    setSelectedUser(null);
    const dummyBot = {
        _id: "dummy_bot_123",
        name: "ChatBot AI",
        online: true,
        profilePicture: "https://images.pexels.com/photos/8566531/pexels-photo-8566531.jpeg?auto=compress&cs=tinysrgb&w=600",
    };

    setSelectedBot(dummyBot);
},  [setSelectedGroup, setSelectedUser,setSelectedBot]);


  return (
    <>
      <div className="h-full bg-[#101828] justify-between border-gray-400 border-r-[1px] flex flex-col p-2 pt-5 gap-4 w-16">
        {/* Top Icons */}
        <div className="flex flex-col-reverse gap-6 relative">
          <div onClick={()=>handleChatBot()} className="p-2 rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out cursor-pointer shadow-lg shadow-purple-500/50 animate-bounce motion-reduce:animate-none">
            <BotMessageSquare className="w-8 text-yellow-400 drop-shadow-lg animate-floating" />
          </div>
          <div  className="p-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer">
            <GroupIcon className="w-8 text-white" />
          </div>
          <div className="p-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer relative">
            <MessageSquare className="w-8 text-white" />
            {totalUnreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalUnreadMessages > 99 ? "99+" : totalUnreadMessages}
              </span>
            )}
          </div>
          <div
            className="p-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => setIsProfileOpen(true)}
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <User className="w-8 text-white" />
            )}
          </div>
        </div>

        {/* Bottom Icons */}
        <div className="flex flex-col gap-4">
          <div
            className="p-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="w-8 text-white" />
          </div>
          <div
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out cursor-pointer"
          >
            <LogOut className="w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Sidebar;
