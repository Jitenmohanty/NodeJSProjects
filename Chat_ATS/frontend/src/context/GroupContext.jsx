// GroupContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const { user, socket } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3000/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (name, description, members) => {
    try {
      const response = await axios.post('http://localhost:3000/groups', {
        name,
        description,
        members
      });
      setGroups(prev => [...prev, response.data]);
      return { success: true, group: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create group'
      };
    }
  };

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  return (
    <GroupContext.Provider value={{
      groups,
      loading,
      fetchGroups,
      createGroup
    }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);