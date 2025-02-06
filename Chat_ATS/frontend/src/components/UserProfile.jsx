import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
const UserProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Add profile update logic here
      alert("Profile Updated: Your profile has been updated successfully.");
    } catch (error) {
      alert("Error: Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">User Profile</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input
            id="email"
            value={user?.email}
            disabled
            className="w-full p-2 border bg-gray-100 rounded-lg"
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
