import { BotMessageSquare } from "lucide-react";
import { useTheme } from "../context/ThemeContex";

const UserList = ({ users, setSelectedUser, unreadMessages, setSelectAi }) => {
  const { darkMode } = useTheme();
  return (
    <div
      className={`flex-1 relative overflow-y-auto ${
        darkMode
          ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "text-gray-700 bg-gradient-to-br from-blue-200 via-white to-blue-100"
      }`}
    >
      {users &&
        users.map((u) => (
          <div
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className="flex items-center gap-3 p-4 hover:bg-opacity-75 cursor-pointer border-b border-gray-300 dark:border-gray-700 transition-all duration-300"
          >
            <div className="relative">
              <div className="w-12 h-12 border-gray-500 border-2 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {u.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                  u.online ? "bg-green-400" : "bg-gray-500"
                }`}
              ></span>
              {unreadMessages[u._id] > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {unreadMessages[u._id]}
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className={`font-semibold text-lg ${!darkMode? 'text-gray-900':'text-gray-200'}`}>
                {u.name.toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {u.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      <div
        onClick={() => setSelectAi((prev) => !prev)}
        className="absolute bottom-4 right-4 cursor-pointer p-3 rounded-full 
                   bg-gradient-to-r from-blue-500 to-purple-700 shadow-lg 
                   shadow-purple-500/50 text-white animate-pulse hover:scale-110 
                   transition-transform duration-300"
      >
        <BotMessageSquare size={40} className="drop-shadow-lg" />
      </div>
    </div>
  );
};

export default UserList;
