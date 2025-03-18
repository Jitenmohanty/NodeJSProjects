import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const RegisterForm = ({ switchToLogin }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    nickname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    bio: "",
    gender: "Male",
    profilePicture: null,
    profilePicturePreview: null, // For previewing the uploaded image
  });
  const { darkMode } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await register(form); // Pass full form data
  
      if (result.success) {
        alert('Registration successful! Please log in.');
        switchToLogin();
      } else {
        alert('Registration failed: ' + result.error);
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({
          ...form,
          profilePicture: file,
          profilePicturePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center mx-auto`}
    >
      <div
        className={`p-4 rounded-lg shadow-xl w-full max-w-lg ${
          darkMode
            ? "bg-gray-800 text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        } transition-all duration-300`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Register
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
          {/* Name and Nickname in one line */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
            <input
              type="text"
              placeholder="Nickname"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
          </div>

          {/* Email and Phone in one line */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
            <input
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
          </div>

          {/* Password and Confirm Password in one line */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
          </div>

          {/* Bio and Gender in one line */}
          <div className="grid grid-cols-2 gap-4">
            {/* Bio Textarea */}
            <textarea
              placeholder="Short Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />

            {/* Gender Radio Buttons */}
            <div className="flex gap-10">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={form.gender === "Male"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className={`form-radio h-4 w-4 ${
                    darkMode ? "text-green-400" : "text-blue-500"
                  } focus:ring-2 focus:ring-green-400 transition-all duration-300`}
                />
                <span className={darkMode ? "text-white" : "text-gray-800"}>
                  Male
                </span>
              </label>
              <label className="flex items-center ">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={form.gender === "Female"}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className={`form-radio h-4 w-4 ${
                    darkMode ? "text-green-400" : "text-blue-500"
                  } focus:ring-2 focus:ring-green-400 transition-all duration-300`}
                />
                <span className={darkMode ? "text-white" : "text-gray-800"}>
                  Female
                </span>
              </label>
             
            </div>
          </div>
          {/* Photo Upload and Preview in one line */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={`w-full p-3 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300`}
            />
            {form.profilePicturePreview && (
              <div className="flex items-center justify-center">
                <img
                  src={form.profilePicturePreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full p-3 rounded-lg font-semibold ${
              isLoading
                ? "bg-green-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            } text-white transition-all duration-300 transform hover:scale-105`}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-6">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className={`font-semibold ${
              darkMode
                ? "text-green-400 hover:text-green-300"
                : "text-blue-500 hover:text-blue-600"
            } transition-all duration-300`}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
