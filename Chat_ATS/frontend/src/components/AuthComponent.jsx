import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContex";

const AuthComponent = () => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { darkMode } = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(loginForm.email, loginForm.password);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (registerForm.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );
      if (result.success) {
        alert("Registration successful! Please log in with your new account.");
        setRegisterForm({ name: "", email: "", password: "" });
        setIsRegistering(false);
      } else {
        alert("Registration failed: " + result.error);
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${
        darkMode
          ? "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-r from-blue-100 via-white to-blue-100"
      } flex flex-col items-center justify-center min-h-screen p-4 transition-all duration-300`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Welcome to Chat App
      </h2>

      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "Switch to Login" : "Switch to Register"}
      </button>

      {/* Conditional Rendering of Forms */}
      {!isRegistering ? (
        <form
          onSubmit={handleLogin}
          className={`bg-white p-6 rounded shadow-md w-full max-w-sm ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm({ ...loginForm, email: e.target.value })
            }
            className={`w-full p-2 border border-gray-300 rounded mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm({ ...loginForm, password: e.target.value })
            }
            className={`w-full p-2 border border-gray-300 rounded mb-4 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleRegister}
          className={`bg-white p-6 rounded shadow-md w-full max-w-sm ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <input
            type="text"
            placeholder="Name"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, name: e.target.value })
            }
            className={`w-full p-2 border border-gray-300 rounded mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, email: e.target.value })
            }
            className={`w-full p-2 border border-gray-300 rounded mb-2 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({ ...registerForm, password: e.target.value })
            }
            className={`w-full p-2 border border-gray-300 rounded mb-4 ${
              darkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthComponent;
