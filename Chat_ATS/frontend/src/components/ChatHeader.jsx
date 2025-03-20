import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  ArrowLeft,
  MoreVertical,
  UserX,
  Delete,
  Bell,
  Info,
  User,
} from "lucide-react";
import { useTheme } from "../context/ThemeContex";
import ProfileModal from "./ProfileModal";
import { useAuth } from "../context/AuthContext";

const ChatHeader = React.memo(
  ({ selectedUser, setSelectedUser, setOpenChat, group, onBack }) => {
    const { darkMode } = useTheme();
    const [showMenu, setShowMenu] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [isBlocked,setIsBlocked] = useState(false)

    

    const { BlockUser, UnblockUser, user } = useAuth();

     useEffect(() => {
        const checkIfUserIsBlocked = () => {
          if (user?.blockedUsers?.includes(selectedUser?._id)) {
            setIsBlocked(true);
          } else {
            setIsBlocked(false);
          }
        };
          checkIfUserIsBlocked();
      }, [user, selectedUser]); // Re-run when user or selectedUser changes
    

    const handleBlockUser = async (id) => {
      await BlockUser(id);
    };

    const handleUnBlockUser = async (id) => {
      await UnblockUser(id);
    };

    // Memoize the handleBack function
    const handleBack = useCallback(() => {
      if (onBack) {
        onBack();
      } else {
        setSelectedUser(null);
      }
    }, [onBack, setSelectedUser]);

    // Determine which entity is selected (user or group)
    const isChat = selectedUser || group;

    // Get avatar, name, and status based on what's selected
    const getAvatar = () => {
      if (group)
        return (
          group.avatar ||
           "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600"
        );
      if (selectedUser)
        return (
          selectedUser.profilePicture ||
           "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600"
        );
      return  "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";
    };

    const getName = () => {
      if (group) return group.name;
      if (selectedUser) return selectedUser.name;
      return "Chat";
    };

    const getStatus = () => {
      if (group) return `${group.members?.length || 0} members`;
      if (selectedUser) return selectedUser.online ? "Online" : "Offline";
      return "";
    };

    const handleProfileClick = () => {
      if (!selectedUser) return;
      setShowMenu(false);
      setOpenProfile(true);
    };

    const toggleMenu = (e) => {
      e.stopPropagation();
      setShowMenu(!showMenu);
    };

    return (
      <div
        className={`p-3 flex items-center justify-between ${
          darkMode
            ? "bg-gradient-to-r from-blue-700 to-blue-800"
            : "bg-gradient-to-r from-blue-500 to-blue-600"
        } relative`}
      >
        {/* Left Section: Back Button and User/Group Info */}
        <div className="flex items-center">
          {/* Back Button */}
          {isChat && (
            <button
              onClick={handleBack}
              className="text-white hover:text-gray-200 mr-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* User/Group Info with Avatar */}
          <div className="flex items-center" onClick={handleProfileClick}>
            <div className="relative cursor-pointer">
              <img
                src={getAvatar()}
                alt={getName()}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              {selectedUser && selectedUser.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="ml-3 cursor-pointer">
              <h2 className="text-white font-medium">{getName()}</h2>
              <p
                className={`text-xs ${
                  selectedUser && selectedUser.online
                    ? "text-green-300"
                    : "text-gray-200"
                }`}
              >
                {getStatus()}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: More Options and Close Button */}
        <div className="flex items-center space-x-2">
          {/* Three-dot Menu Button */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-200 p-1 cursor-pointer"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                <ul className="py-1">
                  <li
                    onClick={handleProfileClick}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    <span>View Info</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer">
                    <Bell className="w-4 h-4 mr-2" />
                    <span>Mute Notifications</span>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer">
                    <Delete className="w-4 h-4 mr-2" />
                    <span>Clear Chat</span>
                  </li>
                  {isBlocked ? (
                    <li
                      onClick={() =>
                        selectedUser && handleUnBlockUser(selectedUser._id)
                      }
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-green-500 cursor-pointer"
                    >
                      <User className="w-4 h-4 mr-2" />
                      <span>Unblock User</span>
                    </li>
                  ) : (
                    <li
                      onClick={() =>
                        selectedUser && handleBlockUser(selectedUser._id)
                      }
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-red-500 cursor-pointer"
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      <span>Block User</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Close Chat Button */}
          <button
            onClick={() => setOpenChat(false)}
            className="text-white hover:text-gray-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Click outside to close menu */}
        {showMenu && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setShowMenu(false)}
          ></div>
        )}
        <ProfileModal
          isOpen={openProfile}
          onClose={() => setOpenProfile(false)}
          data={selectedUser}
        />
      </div>
    );
  }
);

export default ChatHeader;
