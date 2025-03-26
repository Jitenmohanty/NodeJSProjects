// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import useSocket from "../hooks/useSocket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Use the optimized socket hook
  const { socket } = useSocket(user?.id, setUsers);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch users when authenticated
  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/validate-token`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      logout();
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FRONTEND_URI}/users/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);

      await fetchUsers();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (formData) => {
    try {
      const {
        name,
        nickname,
        email,
        phone,
        password,
        bio,
        gender,
        profilePicture,
      } = formData;

      const formPayload = new FormData();
      formPayload.append("name", name);
      formPayload.append("nickname", nickname);
      formPayload.append("email", email);
      formPayload.append("phone", phone);
      formPayload.append("password", password);
      formPayload.append("bio", bio);
      formPayload.append("gender", gender);

      if (profilePicture) {
        formPayload.append("profilePicture", profilePicture);
      }

      await axios.post(
        `${import.meta.env.VITE_FRONTEND_URI}/users/register`,
        formPayload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const updateProfile = async (id, updatedData) => {
    try {
      const formData = new FormData();

      // Only append fields that changed
      Object.keys(updatedData).forEach((key) => {
        // Skip the preview and only include real data
        if (key !== "profilePicturePreview" && updatedData[key]) {
          formData.append(key, updatedData[key]);
        }
      });

      const response = await axios.put(
        `${import.meta.env.VITE_FRONTEND_URI}/users/update-profile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Profile update failed",
      };
    }
  };

  const logout = () => {
    if (socket && user) {
      socket.emit("user_disconnected", user.id);
    }

    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setUsers([]); // Clear users list on logout
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_FRONTEND_URI}/users`
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const BlockUser = async (id) => {
    try {
      console.log("Blocking user...");
      let token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_FRONTEND_URI}/users/block/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      const data = await response.json();

      setUser((prev) => ({
        ...prev,
        blockedUsers: data.blockedUsers, // Updating blockedUsers correctly
      }));

      console.log(data);
      alert(data.message);
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    }
  };

  const UnblockUser = async (id) => {
    try {
      let token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_FRONTEND_URI}/users/unblock/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      const data = await response.json();

      setUser((prev) => ({
        ...prev,
        blockedUsers: prev.blockedUsers.filter((userId) => userId !== id), // Remove unblocked user from state
      }));

      alert(data.message);
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchUsers,
        users,
        setUsers,
        socket,
        updateProfile,
        BlockUser,
        UnblockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
