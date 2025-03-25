import React, { useCallback } from "react";
import { useTheme } from "../../context/ThemeContex";

const UserList = ({ users, setSelectedUser, unreadMessages, setSelectedGroup,setSelectedBot }) => {
  const { darkMode } = useTheme();

  // Memoize function to prevent unnecessary re-renders
  const handleUserSelection = useCallback(
    (user) => {
      setSelectedGroup(null);
      setSelectedBot(null)
      setSelectedUser(user);
    },
    [setSelectedGroup, setSelectedUser,setSelectedBot]
  );

  return (
    <div className="flex-1 relative overflow-y-auto">
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => handleUserSelection(u)}
          className="flex items-center gap-3 py-2 px-2 hover:bg-opacity-75 cursor-pointer border-b border-gray-300 dark:border-gray-700 transition-all duration-300 hover:bg-gray-700"
        >
          {/* Profile Picture */}
          <div className="relative">
            {u.profilePicture ? (
              <img
                src={u.profilePicture}
                alt="Profile Picture"
                className="w-12 h-12 rounded-full border-2 border-gray-500 object-cover"
              />
            ) : (
              <div className="w-12 h-12 border-gray-500 border-2 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {u.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Online/Offline Status */}
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                u.online ? "bg-green-400" : "bg-gray-500"
              }`}
            ></span>

            {/* Unread Messages Badge */}
            {unreadMessages[u._id] > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {unreadMessages[u._id]}
              </div>
            )}
          </div>

          {/* User Name & Online Status */}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${!darkMode ? "text-gray-900" : "text-gray-200"}`}>
              {u.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {u.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Prevents unnecessary re-renders
export default React.memo(UserList);
