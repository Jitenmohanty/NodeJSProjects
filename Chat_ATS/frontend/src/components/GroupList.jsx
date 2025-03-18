import React, { useCallback } from "react";
import { useGroup } from "../context/GroupContext";
import { useTheme } from "../context/ThemeContex";

const GroupList = ({ setSelectedGroup, unreadGroupMessages, setSelectedUser }) => {
  const { groups, loading } = useGroup();
  const { darkMode } = useTheme();

  // Handle loading state
  if (loading) {
    return <div className="p-4 text-center text-white">Loading groups...</div>;
  }

  // Memoized group selection handler
  const handleGroupSelection = useCallback(
    (group) => {
      setSelectedUser(null);
      setSelectedGroup(group);
    },
    [setSelectedGroup, setSelectedUser]
  );

  return (
    <div className="overflow-y-auto">
      {groups?.length > 0 ? (
        groups.map((group) => (
          <div
            key={group._id}
            className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer transition relative"
            onClick={() => handleGroupSelection(group)}
          >
            {/* Group Icon & Details */}
            <div className="flex items-center gap-3">
              {/* Group Icon */}
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-full border-2 border-gray-500">
                {group.name?.charAt(0).toUpperCase()}
              </div>

              {/* Group Name & Member Count */}
              <div>
                <h3
                  className={`font-semibold text-lg ${
                    darkMode ? "text-gray-200" : "text-gray-900"
                  }`}
                >
                  {group.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {group.members?.length || 0} members
                </p>
              </div>
            </div>

            {/* Unread Messages Badge (Properly Styled) */}
            {unreadGroupMessages?.[group._id] > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                {unreadGroupMessages[group._id] > 99 ? "99+" : unreadGroupMessages[group._id]}
              </span>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">No groups available</div>
      )}
    </div>
  );
};

export default React.memo(GroupList);
