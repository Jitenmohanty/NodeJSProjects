import React from "react";

const AddMembersModal = ({ 
  availableMembers, 
  selectedUsers, 
  handleSelectUser, 
  handleAddMembers, 
  closeModal, 
  loading 
}) => {
  // Default avatar if user has no profile picture
  const defaultAvatar = "https://images.pexels.com/photos/1435517/pexels-photo-1435517.jpeg?auto=compress&cs=tinysrgb&w=600";
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-60 bg-black bg-opacity-75">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-w-full mx-4 border border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-white">Add Members</h2>
        
        {availableMembers.length === 0 ? (
          <p className="text-gray-300 py-4">No available users to add.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto mb-4">
            {availableMembers.map((user) => (
              <div
                key={user._id}
                className="flex justify-between items-center p-3 border-b border-gray-700 hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={user?.profilePicture || defaultAvatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleSelectUser(user._id)}
                  className="h-5 w-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddMembers}
            disabled={selectedUsers.length === 0 || availableMembers.length === 0 || loading}
            className={`px-4 py-2 rounded text-white ${
              selectedUsers.length === 0 || availableMembers.length === 0 || loading
                ? "bg-blue-800 opacity-50 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 transition-colors"
            }`}
          >
            {loading ? "Adding..." : "Add Members"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;