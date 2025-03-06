import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadGroupMessages, setUnreadGroupMessages] = useState({});

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching groups for user", user.id);
      const response = await axios.get('http://localhost:3000/groups');
      setGroups(response.data);
      
      // Fetch unread group messages
      const unreadResponse = await axios.get('http://localhost:3000/groups/unread');
      
      // Process unread messages
      const unreadCounts = {};
      if (unreadResponse.data && unreadResponse.data.length > 0) {
        unreadResponse.data.forEach(item => {
          unreadCounts[`group_${item.groupId}`] = item.count;
        });
      }
      
      setUnreadGroupMessages(unreadCounts);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createGroup = async (name, description, members) => {
    try {
      console.log("Creating new group:", { name, description, members });
      const response = await axios.post('http://localhost:3000/groups', {
        name,
        description,
        members: [...members, user.id] // Ensure creator is a member
      });
      
      setGroups(prev => [...prev, response.data]);
      return { success: true, group: response.data };
    } catch (error) {
      console.error("Group creation failed:", error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create group'
      };
    }
  };
  
  const getGroupById = useCallback(async (groupId) => {
    try {
      const cachedGroup = groups.find(g => g._id === groupId);
      if (cachedGroup) return cachedGroup;
      
      const response = await axios.get(`http://localhost:3000/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get group ${groupId}:`, error);
      return null;
    }
  }, [groups]);
  
  const updateUnreadCount = useCallback((groupId, count) => {
    setUnreadGroupMessages(prev => ({
      ...prev,
      [`group_${groupId}`]: count
    }));
  }, []);
  
  const clearUnreadCount = useCallback((groupId) => {
    setUnreadGroupMessages(prev => ({
      ...prev,
      [`group_${groupId}`]: 0
    }));
  }, []);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user, fetchGroups]);

  return (
    <GroupContext.Provider value={{
      groups,
      loading,
      fetchGroups,
      createGroup,
      getGroupById,
      unreadGroupMessages,
      updateUnreadCount,
      clearUnreadCount
    }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);

export default GroupProvider;