import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const GroupContext = createContext(null);

export const GroupProvider = ({ children }) => {
  const { user, socket } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadGroupMessages, setUnreadGroupMessages] = useState({});
  const [activeGroupId, setActiveGroupId] = useState(null); // Track which group the user is viewing

  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/groups');
      setGroups(response.data);
      
      // Fetch unread group messages
      const unreadResponse = await axios.get('http://localhost:3000/groups/unread');
      console.log("Unread group messages:", unreadResponse.data);
      
      // Process unread messages
      const unreadCounts = {};
      if (unreadResponse.data && unreadResponse.data.length > 0) {
        unreadResponse.data.forEach(item => {
          unreadCounts[item.groupId] = item.count;
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
      const response = await axios.post('http://localhost:3000/groups', {
        name,
        description,
        members
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
  
  const getGroupById = useCallback((groupId) => {
    return groups.find(g => g._id === groupId) || null;
  }, [groups]);
  
  const updateUnreadCount = useCallback((groupId, countOrUpdater) => {
    setUnreadGroupMessages(prev => {
      const currentCount = prev[groupId] || 0;
      const newCount = typeof countOrUpdater === 'function' 
        ? countOrUpdater(currentCount) 
        : countOrUpdater;
      
      return {
        ...prev,
        [groupId]: newCount
      };
    });
  }, []);
  
  const clearUnreadCount = useCallback((groupId) => {
    setUnreadGroupMessages(prev => ({
      ...prev,
      [groupId]: 0
    }));
  }, []);
  
  const setActiveGroup = useCallback((groupId) => {
    setActiveGroupId(groupId);
    // When a group becomes active, clear its unread count
    if (groupId) {
      clearUnreadCount(groupId);
    }
  }, [clearUnreadCount]);

  // Listen for socket events
  useEffect(() => {
    if (!socket || !user) return;

    // Standard group message reception
    const handleReceiveGroupMessage = (data) => {
      if (data.message && data.message.group) {
        const groupId = data.message.group;
        
        // Only update count if this message is not from current user and user is not viewing this group
        if (data.message.sender !== user.id && activeGroupId !== groupId) {
          updateUnreadCount(groupId, count => (count || 0) + 1);
        }
      }
    };
    
    // Special notification for when user is not in the group chat but online
    const handleGroupNotification = (data) => {
      if (data.groupId) {
        // Only increment if not actively viewing this group
        if (activeGroupId !== data.groupId) {
          updateUnreadCount(data.groupId, count => (count || 0) + 1);
          
          // Optionally show a browser notification
          if (Notification.permission === "granted") {
            const group = getGroupById(data.groupId);
            const groupName = group ? group.name : "A group";
            new Notification(`New message in ${groupName}`, {
              body: `${data.sender.name}: ${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}`
            });
          }
        }
      }
    };

    socket.on('receive_group_message', handleReceiveGroupMessage);
    socket.on('group_message_notification', handleGroupNotification);

    return () => {
      socket.off('receive_group_message', handleReceiveGroupMessage);
      socket.off('group_message_notification', handleGroupNotification);
    };
  }, [socket, user, activeGroupId, updateUnreadCount, getGroupById]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchGroups();
      
      // Request notification permission on first load
      if (Notification.permission !== "denied" && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
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
      clearUnreadCount,
      activeGroupId,
      setActiveGroup
    }}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => useContext(GroupContext);

export default GroupProvider;