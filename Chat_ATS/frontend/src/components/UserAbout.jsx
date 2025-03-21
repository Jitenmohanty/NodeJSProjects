import React from "react";

const UserAbout = ({ userData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
        About
      </h3>
      <div className="bg-gray-800 p-4 rounded-lg">
        <p className="text-white whitespace-pre-line">{userData.about}</p>
      </div>
    </div>
  );
};

export default UserAbout;