import React from "react";
import { useGroup } from "../context/GroupContext";

const GroupList = ({ setSelectedGroup, unreadMessages }) => {
  const { groups, loading } = useGroup();

  if (loading) {
    return <div className="p-4 text-center">Loading groups...</div>;
  }
  // console.log(unreadMessages)

  return (
    <div className="overflow-y-auto">
      {groups.map((group) => (
        <div
          key={group._id}
          className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition"
          onClick={() => setSelectedGroup(group)}
        >
          {/* Group Icon & Details */}
          <div className="flex items-center gap-3">
            {/* Group Icon */}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg rounded-full border-2 border-gray-500">
              {group.name?.charAt(0).toUpperCase()}
            </div>

            {/* Group Name & Member Count */}
            <div>
              <h3 className="text-white font-semibold">{group.name}</h3>
              <p className="text-gray-400 text-sm">{group.members.length} members</p>
            </div>
          </div>

          {/* Unread Messages Badge */}
          {unreadMessages[group._id] > 0 && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {unreadMessages[group._id]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupList;
