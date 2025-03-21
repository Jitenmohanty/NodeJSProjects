import React from "react";

const UserStats = ({ userData }) => {
  return (
    <div className="grid grid-cols-3 gap-3 bg-gray-800 rounded-lg p-4">
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{userData?.posts || 0}</span>
        <span className="text-gray-400 text-xs">Posts</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{userData?.followers || 0}</span>
        <span className="text-gray-400 text-xs">Followers</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{userData?.following || 0}</span>
        <span className="text-gray-400 text-xs">Following</span>
      </div>
    </div>
  );
};

export default UserStats;