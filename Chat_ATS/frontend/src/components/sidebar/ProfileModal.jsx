import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../context/GroupContext";
import ProfileHeader from "./ProfileHeader";
import UserStats from "./UserStats";
import GroupMembersList from "./GroupMembersList";
import GroupInfo from "./GroupInfo";
import UserInfo from "./UserInfo";
import UserAbout from "./UserAbout";
import AddMembersModal from "./AddMembersModal";

const ProfileModal = ({ isOpen, onClose, data }) => {
  const { user: currentUser, users } = useAuth();
  const { addMembersToGroup, groups } = useGroup();


  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Use the provided data or fall back to the current user profile
  const userData = data || currentUser;
  // Check if data is a group (has members array)
  const isGroup = userData?.members && Array.isArray(userData.members);

  // Filter to get the complete group data from groups context
  let selectGroupMember = [];
  selectGroupMember = isGroup && groups.filter(gr => gr._id === userData._id);

  useEffect(() => {
    if (isGroup && users) {
      updateAvailableMembers();
    }
  }, [isGroup, userData, users]);

  // Filter users to show only those not already in the group
  const updateAvailableMembers = () => {
    if (!users || !selectGroupMember[0]?.members) return;
    
    // Get all member IDs from the group
    const memberIds = selectGroupMember[0].members.map(member => 
      typeof member === 'object' ? member._id : member
    );
    
    // Filter available users
    const filteredUsers = users.filter(user => !memberIds.includes(user._id));
    setAvailableMembers(filteredUsers);
  };

  // Handle selecting/deselecting users to add to group
  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Open the add members modal
  const handleOpenAddMembersModal = () => {
    updateAvailableMembers();
    setSelectedUsers([]);
    setShowAddMemberModal(true);
  };

  // Handle adding selected users to the group
  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }

    try {
      setLoading(true);
      // Use the group ID from the selected group
      await addMembersToGroup(selectGroupMember[0]._id, selectedUsers);
      alert("Members added successfully!");
      setSelectedUsers([]);
      setShowAddMemberModal(false);
    } catch (error) {
      console.error("Error adding members:", error);
      alert(`Failed to add members: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is an admin of the group using the selected group data
  const isCurrentUserAdmin = isGroup && selectGroupMember[0]?.admins?.some(
    admin => typeof admin === 'object' 
      ? admin._id === currentUser?._id 
      : admin === currentUser?._id
  );

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={onClose} 
        />
      )}

      {/* Main Modal */}
      <div
        className={`fixed top-0 left-0 h-full w-80 md:w-[29vw] z-50 bg-gradient-to-b from-gray-900 to-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto overflow-x-hidden no-scrollbar
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 bg-opacity-80 backdrop-blur-sm px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            {isGroup ? "Group Profile" : "Profile"}
          </h2>
          <button
            className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700"
            onClick={onClose}
            aria-label="Close profile"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">
          {/* Profile Picture and Basic Info - use the selected group data if it's a group */}
          <ProfileHeader 
            userData={isGroup ? selectGroupMember[0] : userData} 
            isGroup={isGroup} 
          />

          {/* Group Members Section for Group Profile */}
          {isGroup && selectGroupMember[0]?.members && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider px-2">
                  Group Members ({selectGroupMember[0].members.length})
                </h3>
                {isCurrentUserAdmin && (
                  <button
                    onClick={handleOpenAddMembersModal}
                    className="flex items-center gap-1 text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Plus size={16} /> Add Members
                  </button>
                )}
              </div>
              <GroupMembersList 
                members={selectGroupMember[0].members} 
                admins={selectGroupMember[0].admins} 
                users={users}
                groupId={selectGroupMember[0]._id}
              />
            </div>
          )}

          {/* Stats Section for User Profile */}
          {!isGroup && <UserStats userData={userData} />}

          {/* Group Info for Group Profile - use the selected group data */}
          {isGroup && <GroupInfo userData={selectGroupMember[0]} />}

          {/* User Details for Individual Profile */}
          {!isGroup && <UserInfo userData={userData} />}

          {/* About Section for User Profile */}
          {!isGroup && userData?.about && <UserAbout userData={userData} />}
        </div>

        {/* Add Members Modal */}
        {showAddMemberModal && (
          <AddMembersModal
            availableMembers={availableMembers}
            selectedUsers={selectedUsers}
            handleSelectUser={handleSelectUser}
            handleAddMembers={handleAddMembers}
            closeModal={() => setShowAddMemberModal(false)}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default ProfileModal;