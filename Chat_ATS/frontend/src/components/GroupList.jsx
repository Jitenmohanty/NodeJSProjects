import React, { useCallback, useState } from "react";
import { useGroup } from "../context/GroupContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const GroupList = ({ setSelectedGroup, unreadGroupMessages, setSelectedUser }) => {
  const { 
    groups, 
    loading, 
    isAuthorizedForGroup, 
    verifyGroupPassword, 
    setActiveGroup 
  } = useGroup();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedGroupState, setSelectedGroupState] = useState(null);

  // Handle loading state
  if (loading) {
    return <div className="p-4 text-center text-white">Loading groups...</div>;
  }

  // Function to verify password
  const handleVerifyPassword = async () => {
    try {
      const result = await verifyGroupPassword(selectedGroupState._id, password);
      
      if (result.success) {
        setSelectedUser(null);
        setSelectedGroup(selectedGroupState);
        setActiveGroup(selectedGroupState._id);
        setShowPasswordModal(false);
        setError("");
        setPassword(""); // Clear password field
      } else {
        setError(result.error || "Incorrect password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  // Memoized group selection handler
  const handleGroupSelection = useCallback((group) => {
    setSelectedUser(null);

    // Check if the user is an admin
    const isAdmin = group.admins?.some(admin => admin._id === user?._id);
    // Check if user has already entered password for this group
    const isAuthorized = isAuthorizedForGroup(group._id);
    console.log(isAdmin)
    if (isAdmin) {
      // Admin users can enter directly without password
      setSelectedGroup(group);
      setActiveGroup(group._id);
    } else if (isAuthorized) {
      // Previously authorized non-admin users can enter directly
      setSelectedGroup(group);
      setActiveGroup(group._id);
    } else {
      // Non-authorized users need to enter password
      setSelectedGroupState(group);
      setShowPasswordModal(true);
    }
  }, [setSelectedGroup, user, isAuthorizedForGroup, setActiveGroup]);

  // Handle Enter key press in password input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleVerifyPassword();
    }
  };

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

            {/* Unread Messages Badge */}
            {unreadGroupMessages?.[group._id] > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                {unreadGroupMessages[group._id] > 99 ? "99+" : unreadGroupMessages[group._id]}
              </span>
            )}
            
            {/* Authorized Indicator (optional) */}
            {isAuthorizedForGroup(group._id) && !group.admins?.some(admin => admin._id === user?.id) && (
              <div className="absolute right-3 bottom-2">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">No groups available</div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className={`relative w-full max-w-md p-6 rounded-xl shadow-2xl transform transition-all 
            ${darkMode 
              ? "bg-gray-800 border border-gray-700" 
              : "bg-white border border-gray-200"
            }`}
          >
            {/* Modal Header */}
            <div className="mb-5">
              <h3 className={`text-xl font-bold 
                ${darkMode ? "text-white" : "text-gray-900"}`}>
                Enter Group Password
              </h3>
              <p className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                This group is password-protected
              </p>
            </div>
            
            {/* Group Info */}
            {selectedGroupState && (
              <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-opacity-10 bg-blue-500">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold rounded-full">
                  {selectedGroupState.name?.charAt(0).toUpperCase()}
                </div>
                <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {selectedGroupState.name}
                </span>
              </div>
            )}
            
            {/* Password Input */}
            <div className="mb-5">
              <label 
                htmlFor="group-password" 
                className={`block mb-2 text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                Password
              </label>
              <input
                id="group-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter group password"
                className={`w-full p-3 rounded-lg transition focus:ring-2 focus:outline-none
                  ${darkMode 
                    ? "bg-gray-700 border border-gray-600 text-white focus:ring-blue-500" 
                    : "bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-600"
                  }`}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-3 mt-6">
              <button 
                onClick={() => setShowPasswordModal(false)}
                className={`px-4 py-2 rounded-lg font-medium transition
                  ${darkMode 
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyPassword}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Join Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(GroupList);