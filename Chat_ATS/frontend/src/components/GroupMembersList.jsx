import React from "react";
import { Shield, X } from "lucide-react";
import { useGroup } from "../context/GroupContext";
import { useAuth } from "../context/AuthContext";

const GroupMembersList = ({ members, admins, users, groupId }) => {
  // Default avatar if member has no profile picture
  const defaultAvatar = "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";
  const { removeMember } = useGroup();
  const { user: currentUser } = useAuth();

  // Check if current user is an admin of the group
  const isCurrentUserAdmin = admins?.some(
    admin => typeof admin === 'object' 
      ? admin._id === currentUser?._id 
      : admin === currentUser?._id
  );

  const handleRemoveMember = async (userId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      try {
        await removeMember(groupId, userId);
      } catch (error) {
        console.error("Failed to remove member:", error);
        alert("Failed to remove member. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-3">
      {members.map((member) => {
        // Handle both object members and ID members
        const memberObj = typeof member === 'object' ? member : 
          users?.find(u => u._id === member) || { _id: member, name: "Unknown User", email: "unknown" };
          
        const isAdmin = admins?.some(
          (admin) => typeof admin === 'object' 
            ? admin._id === memberObj._id 
            : admin === memberObj._id
        );
        
        // Don't allow admins to remove other admins or themselves
        const canRemove = isCurrentUserAdmin && !isAdmin && memberObj._id !== currentUser?._id;
        
        return (
          <div
            key={memberObj._id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={memberObj?.profilePicture || defaultAvatar}
                  alt={memberObj.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                />
                {memberObj.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-gray-800"></div>
                )}
              </div>
              <div>
                <p className="text-white text-sm">{memberObj.name}</p>
                <p className="text-gray-400 text-xs">{memberObj.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <span className="text-amber-500 text-xs px-2 py-1 bg-gray-700 rounded-full flex items-center">
                  <Shield size={12} className="mr-1" />
                  Admin
                </span>
              )}
              
              {canRemove && (
                <button
                  onClick={() => handleRemoveMember(memberObj._id)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Remove member"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupMembersList;