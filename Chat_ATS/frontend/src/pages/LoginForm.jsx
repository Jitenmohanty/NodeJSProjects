import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const LoginForm = ({ switchToRegister }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const { darkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        alert("Welcome back! You have successfully logged in.");
      } else {
        alert("Login failed: " + result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`p-8 rounded-lg shadow-xl w-full max-w-sm mx-auto ${
        darkMode
          ? "bg-gray-800 text-white border border-gray-700"
          : "bg-white text-gray-800 border border-gray-200"
      } transition-all duration-300`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
        Login
      </h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 rounded-lg font-semibold ${
            isLoading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
          } text-white transition-all duration-300 transform hover:scale-105`}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-6">
        Don't have an account?{" "}
        <button
          onClick={switchToRegister}
          className={`font-semibold ${
            darkMode ? "text-green-400 hover:text-green-300" : "text-blue-500 hover:text-blue-600"
          } transition-all duration-300`}
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginForm;