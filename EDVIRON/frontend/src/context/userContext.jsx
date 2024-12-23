import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create UserContext
export const UserContext = createContext();

// UserProvider to wrap around the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if token exists in localStorage and set the user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, you can send the token to your backend to verify it and fetch user data
      axios
        .get("/api/users/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // Assuming response contains user data
        })
        .catch((err) => {
          console.error("Token verification failed", err);
          localStorage.removeItem("token"); // Remove invalid token
        });
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async()=>{
    localStorage.removeItem("token"); // Remove invalid token
    setUser(null)
  }


  return (
    <UserContext.Provider value={{ user, updateUser,logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
