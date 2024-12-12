import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Admin', // Default role
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Axios POST request
      const response = await axios.post('/api/users/register', formData);
  
      if (response.status === 201) {
        alert('Registration successful!');
        // Clear the form after success
        setFormData({ username: '', email: '', password: '', role: 'BD' });
      } else {
        alert(`Error: ${response.data.message || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      // Display detailed error message, if available
      const errorMessage =
        error.response?.data?.message || 'Something went wrong. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">Register</h1>
        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          >
            <option value="BD">BD</option>
            <option value="Recruiter">Recruiter</option>
            <option value="Admin">Admin</option>
            <option value="HRManager">HR Manager</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-500 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
