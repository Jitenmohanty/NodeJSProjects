import React, { useState } from 'react';
import { useGroup } from '../context/GroupContext';
import { useAuth } from '../context/AuthContext';

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { users } = useAuth();
  const { createGroup } = useGroup();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createGroup(name, description, selectedMembers);
    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96">
        <h2 className="text-white text-xl mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Group Name"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="mb-4">
            <h3 className="text-white mb-2">Select Members</h3>
            <div className="max-h-40 overflow-y-auto">
              {users.map(user => (
                <label key={user._id} className="flex items-center text-white mb-2">
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
                    className="mr-2"
                  />
                  {user.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-white bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;