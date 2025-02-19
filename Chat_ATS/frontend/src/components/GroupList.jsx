import React from 'react';
import { useGroup } from '../context/GroupContext';

const GroupList = ({ setSelectedGroup, unreadMessages }) => {
  const { groups, loading } = useGroup();

  if (loading) {
    return <div className="p-4 text-center">Loading groups...</div>;
  }

  return (
    <div className="overflow-y-auto">
      {groups.map(group => (
        <div
          key={group._id}
          className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
          onClick={() => setSelectedGroup(group)}
        >
          <div className="flex-1">
            <h3 className="text-white font-medium">{group.name}</h3>
            <p className="text-gray-400 text-sm">{group.members.length} members</p>
          </div>
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