import React, { useState } from "react";
import { Menu, Search, ArrowLeft } from "lucide-react";
import UserList from "./UserList";
import GroupList from "./GroupList";

const ChatList = ({
  users,
  setSelectedUser,
  setSelectedGroup,
  unreadMessages,
  unreadGroupMessages,
  openGroupModal,
  darkMode,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");

  return (
    <div
      className={`w-1/4 h-full flex flex-col ${
        darkMode
          ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "text-gray-700 bg-gradient-to-br from-blue-200 via-white to-blue-100"
      } border-gray-400 border-r-[1px]`}
    >
      {/* Header */}
      <div className="h-[9.40vh] flex justify-between items-center p-2 ">
        <h1 className="font-bold text-2xl">Chats</h1>
        <Menu />
      </div>

      {/* Search Bar */}
      <div className="mx-2 mb-2 p-2 rounded-[8px] flex items-center bg-gray-700 transition-all duration-300">
        <button onClick={() => setIsFocused(false)}>
          {isFocused ? (
            <ArrowLeft className="text-white w-4 mx-4 cursor-pointer" />
          ) : (
            <Search className="text-white w-4 mx-4 cursor-pointer" />
          )}
        </button>
        <input
          type="text"
          className="bg-transparent text-white outline-none w-full placeholder-gray-400 transition-all duration-300"
          placeholder="Search..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-start space-x-2 p-2 border-b border-gray-400">
        {["All", "Unread", "Favorites", "Groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded-full text-sm font-normal transition-all duration-300 ${
              selectedTab === tab
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          users={users}
          setSelectedUser={setSelectedUser}
          setSelectedGroup={setSelectedGroup}
          unreadMessages={unreadMessages}
        />
        <GroupList
          setSelectedGroup={setSelectedGroup}
          unreadGroupMessages={unreadGroupMessages}
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Create Group Button (Sticks to Bottom) */}
      <button
        onClick={openGroupModal}
        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
      >
        Create New Group
      </button>
    </div>
  );
};

export default ChatList;
