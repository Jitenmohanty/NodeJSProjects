import React, { useState } from "react";
import { Settings, Shield, X } from "lucide-react";
import { useGroup } from "../../context/GroupContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const GroupMembersList = ({ members, admins, users, groupId, groupData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: groupData?.name || "",
    bio: groupData?.bio || "",
    password: "",
  });

  const defaultAvatar = "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";
  const { removeMember, updateGroup } = useGroup();
  const { user: currentUser } = useAuth();

  const isCurrentUserAdmin = admins?.some(
    admin => typeof admin === 'object' 
      ? admin._id === currentUser?._id 
      : admin === currentUser?._id
  );

  const handleRemoveMember = async (userId, name) => {
    toast.info(
      <div>
        <p>Are you sure you want to remove {name}😢?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                await removeMember(groupId, userId);
                toast.success("Member removed successfully! ✅");
              } catch (error) {
                console.error("Failed to remove member:", error);
                toast.error("Failed to remove member. Please try again.");
              }
              toast.dismiss();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-md"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded-md"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleUpdateClick = () => {
    if (isCurrentUserAdmin) {
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGroup(groupId, formData);
      toast.success("Group updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to update group. Please try again.");
      console.error("Update group error:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-3 relative">
      {members.map((member) => {
        const memberObj = typeof member === 'object' ? member : 
          users?.find(u => u._id === member) || { _id: member, name: "Unknown User", email: "unknown" };
          
        const isAdmin = admins?.some(
          (admin) => typeof admin === 'object' 
            ? admin._id === memberObj._id 
            : admin === memberObj._id
        );
        
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
                  onClick={() => handleRemoveMember(memberObj._id, memberObj.name)}
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

      {isCurrentUserAdmin && (
        <>
          <div 
            onClick={handleUpdateClick} 
            className="flex justify-end items-end mr-2 cursor-pointer"
          >
            <Settings className="text-gray-400 hover:text-white" />
          </div>

          {/* Settings Modal */}
          {isModalOpen && (
            <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Group Settings</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Group Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Group Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GroupMembersList;