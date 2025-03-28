import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Menu, Search, ArrowLeft } from "lucide-react";
import UserList from "./UserList";
import GroupList from "../groupChat/GroupList";
import { useGroup } from "../../context/GroupContext";

const ChatList = ({
  users,
  setSelectedUser,
  setSelectedGroup,
  unreadMessages,
  unreadGroupMessages,
  openGroupModal,
  darkMode,
  setSelectedBot,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [search, setSearch] = useState("");
  const { groups } = useGroup();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  // Sort users by lastMessageTimestamp (newest first) and prioritize unread messages
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      // First sort by unread status
      const unreadA = unreadMessages[a._id] || 0;
      const unreadB = unreadMessages[b._id] || 0;
      
      if (unreadA !== unreadB) {
        return unreadB - unreadA; // More unreads first
      }
      
      // Then by timestamp
      const timeA = a.lastMessageTimestamp || 0;
      const timeB = b.lastMessageTimestamp || 0;
      return timeB - timeA; // Newest first
    });
  }, [users, unreadMessages]);

  // Memoize groups
  const memoizedGroups = useMemo(() => groups, [groups]);

  // Debounce function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Filter function for both users and groups
  const filterItems = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(sortedUsers);
      setFilteredGroups(memoizedGroups);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    
    setFilteredUsers(
      sortedUsers.filter(user => 
        user.name.toLowerCase().includes(lowerSearch))
    );
    
    setFilteredGroups(
      memoizedGroups.filter(group => 
        group.name.toLowerCase().includes(lowerSearch))
    );
  }, [sortedUsers, memoizedGroups]);

  // Create debounced version of filterItems
  const debouncedFilter = useMemo(
    () => debounce(filterItems, 300),
    [filterItems]
  );

  // Handle search input changes
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedFilter(value);
  };

  // Initialize filtered data
  useEffect(() => {
    setFilteredUsers(sortedUsers);
    setFilteredGroups(memoizedGroups);
  }, [sortedUsers, memoizedGroups]);

  // Filter items based on selected tab
  const getFilteredItems = (items, isGroup = false) => {
    if (search.length > 0) {
      return isGroup ? filteredGroups : filteredUsers;
    }
  
    switch (selectedTab) {
      case "Unread":
        return items.filter(item => {
          const unreadCount = isGroup 
            ? unreadGroupMessages[item._id] 
            : unreadMessages[item._id];
          return unreadCount > 0;
        });
      
      case "Groups":
        return isGroup ? items : [];
      
      case "Favorites":
        return items.filter(item => item.isFavorite);
      
      default:
        return items;
    }
  };

  const filteredUserList = getFilteredItems(sortedUsers);
  const filteredGroupList = getFilteredItems(groups, true);

  return (
    <div
      className={`w-1/4 h-full flex flex-col ${
        darkMode
          ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "text-gray-700 bg-gradient-to-br from-blue-200 via-white to-blue-100"
      } border-gray-400 border-r-[1px]`}
    >
      {/* Header */}
      <div className="h-[9.40vh] flex justify-between items-center p-2">
        <h1 className="font-bold text-2xl">Chats</h1>
        <Menu />
      </div>

      {/* Search Bar */}
      <div className={`mx-2 mb-2 p-1 rounded-[8px] flex items-center ${
        darkMode ? "bg-gray-700" : "bg-gray-200"
      } transition-all duration-300`}>
        <button onClick={() => setIsFocused(false)}>
          {isFocused ? (
            <ArrowLeft className={`w-4 mx-4 ${darkMode ? "text-white" : "text-gray-700"}`} />
          ) : (
            <Search className={`w-4 mx-4 ${darkMode ? "text-white" : "text-gray-700"}`} />
          )}
        </button>
        <input
          type="text"
          value={search}
          className={`bg-transparent ${
            darkMode ? "text-white" : "text-gray-900"
          } outline-none w-full placeholder-gray-400 transition-all duration-300 placeholder:text-sm`}
          placeholder="Search users or groups..."
          onChange={handleSearch}
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
            className={`px-2 py-1 rounded-full text-xs font-normal transition-all duration-300 cursor-pointer ${
              selectedTab === tab
                ? darkMode
                  ? "bg-blue-600 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scrollable Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {selectedTab !== "Groups" && (
          <UserList
            users={filteredUserList}
            setSelectedUser={setSelectedUser}
            setSelectedGroup={setSelectedGroup}
            unreadMessages={unreadMessages}
            setSelectedBot={setSelectedBot}
          />
        )}

        {(selectedTab === "All" || selectedTab === "Groups" || selectedTab === "Unread") && (
          <GroupList
            groups={filteredGroupList}
            setSelectedGroup={setSelectedGroup}
            unreadGroupMessages={unreadGroupMessages}
            setSelectedUser={setSelectedUser}
            setSelectedBot={setSelectedBot}
          />
        )}

        {search.length > 0 && filteredUserList.length === 0 && filteredGroupList.length === 0 && (
          <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No results found for "{search}"
          </div>
        )}
      </div>

      {/* Create Group Button */}
      <button
        onClick={openGroupModal}
        className={`w-full p-3 ${
          darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
        } text-white transition-colors`}
      >
        Create New Group
      </button>
    </div>
  );
};

export default ChatList;