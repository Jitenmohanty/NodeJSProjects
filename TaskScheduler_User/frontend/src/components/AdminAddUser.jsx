import React, { useState } from "react";
import axios from "axios";

const AdminAddUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("User"); // Default to 'User'
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name || !email) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // Send data to the server
      await axios.post("/api/users/addUser", {
        name,
        email,
        userType,
      });

      setSuccess(true); // Set success message
      setError(null);   // Clear error message
      // Optionally reset form fields after success
      setName("");
      setEmail("");
      setUserType("User");
    } catch (error) {
      setError("Error adding user. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New User</h2>
      
      {success && (
        <div className="bg-green-200 text-green-800 p-2 rounded mb-4 text-center">
          User successfully added!
        </div>
      )}
      
      {error && (
        <div className="bg-red-200 text-red-800 p-2 rounded mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700">User Type</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Manager">BD</option>
            <option value="Manager">Recruiter</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddUser;
