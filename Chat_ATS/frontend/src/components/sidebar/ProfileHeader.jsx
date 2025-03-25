import React from "react";

const ProfileHeader = ({ userData, isGroup }) => {
  // Default avatar if userData has no profile picture
  const defaultAvatar = "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={userData?.profilePicture || defaultAvatar}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-gray-700"
        />
        {!isGroup && userData?.online && (
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
        )}
      </div>
      <h2 className="text-white text-lg font-medium mt-4">
        {userData?.name || "User Name"}
      </h2>
      <p className="text-gray-400 text-sm mt-2 text-center">
        {userData?.bio || userData?.description || "No description available"}
      </p>

      {userData?.status && (
        <div className="mt-4 px-3 py-1 bg-gray-800 rounded-full">
          <p className="text-gray-300 text-sm">{userData.status}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;