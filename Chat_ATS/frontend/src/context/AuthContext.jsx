import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Handle socket events and user status
  useEffect(() => {
    if (!socket) return;

    // Listen for user status changes
    socket.on('user_status_change', ({ userId, online }) => {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u._id === userId ? { ...u, online } : u
        )
      );
    });

    // Reconnect handler
    socket.on('connect', () => {
      if (user) {
        socket.emit('user_connected', user.id);
      }
    });

    return () => {
      socket.off('user_status_change');
      socket.off('connect');
    };
  }, [socket, user]);

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  // Emit online status when user state changes
  useEffect(() => {
    if (socket && user) {
      socket.emit('user_connected', user.id);
      fetchUsers(); // Fetch users when authenticated
    }
  }, [socket, user]);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:3000/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/login', {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      if (socket) {
        socket.emit('user_connected', user.id);
      }
      
      await fetchUsers();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('http://localhost:3000/register', {
        name,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    if (socket && user) {
      socket.emit('user_disconnected', user.id);
    }
    
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setUsers([]); // Clear users list on logout
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
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
        socket
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};