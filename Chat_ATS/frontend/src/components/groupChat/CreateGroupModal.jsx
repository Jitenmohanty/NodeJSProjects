import React, { useState } from 'react';
import { useGroup } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'react-toastify';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { users } = useAuth();
  const { createGroup } = useGroup();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!name.trim() || !password.trim()) {
      toast.warn("Group name and password are required! ⚠️");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.warn("You have to add at least one member ⚠️");
      return;
    }
  
    setIsCreating(true);
    const result = await createGroup(name, description, selectedMembers, password);
    setIsCreating(false);
  
    if (result.success) {
      toast.success("Group created successfully! 🎉");
      onClose();
      setName("");
      setDescription("");
      setPassword("");
      setSelectedMembers([]);
    } else {
      toast.error("Failed to create group. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-900">
          <h2 className="text-white text-lg font-semibold">Create New Group</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Group Name *</label>
              <input
                type="text"
                placeholder="Enter group name"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Description</label>
              <textarea
                placeholder="Optional group description"
                className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-1">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Set a group password"
                  className="w-full p-3 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">Minimum 6 characters recommended</p>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">Add Members</label>
              <div className="max-h-[200px] overflow-y-auto bg-gray-700 rounded-md p-3 custom-scrollbar">
                {users.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No users available</p>
                ) : (
                  users.map(user => (
                    <label key={user._id} className="flex items-center space-x-3 p-2 hover:bg-gray-600 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedMembers([...selectedMembers, user._id]);
                          } else {
                            setSelectedMembers(selectedMembers.filter(id => id !== user._id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center text-white mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white">{user.name}</span>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer with Buttons */}
        <div className="p-5 border-t border-gray-700 bg-gray-900">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center"
              disabled={isCreating}
              onClick={handleSubmit}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Group'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
