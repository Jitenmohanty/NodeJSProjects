import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useGroupSocket = (userId, updateUnreadCount) => {
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!userId) return;
    
    if (!socketRef.current) {
      socketRef.current = io(`${import.meta.env.VITE_FRONTEND_URI}`, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
      
      socketRef.current.on('connect', () => {
        console.log('Group socket connected');
      });
      
      socketRef.current.on('disconnect', () => {
        console.log('Group socket disconnected');
      });
      
      socketRef.current.on('connect_error', (err) => {
        console.error('Group socket connection error:', err);
      });
      
      // Add handler for receiving group messages
      socketRef.current.on('receive_group_message', (data) => {
        // Only update unread count if this user isn't the sender
        if (data.message && data.message.sender._id !== userId) {
          const groupId = data.message.group;
          if (updateUnreadCount && groupId) {
            console.log(`Updating unread count for group ${groupId}`);
            updateUnreadCount(groupId, (prev) => (prev || 0) + 1);
          }
        }
      });
      
      // Add handler for group notifications (when user is not actively in the group)
      socketRef.current.on('group_message_notification', (data) => {
        console.log('Received group notification:', data);
        if (data.sender && data.sender._id !== userId && data.groupId) {
          if (updateUnreadCount && typeof updateUnreadCount === 'function') {
            console.log(`Updating unread count for group ${data.groupId} from notification`);
            updateUnreadCount(data.groupId, (prev) => (prev || 0) + 1);
          }
        }
      });
      
      // Handle the alternative event name used in some parts of the code
      socketRef.current.on('group_notification', (data) => {
        console.log('Received group notification (alt):', data);
        if (data.sender && data.sender._id !== userId && data.groupId) {
          if (updateUnreadCount && typeof updateUnreadCount === 'function') {
            console.log(`Updating unread count for group ${data.groupId} from notification (alt)`);
            updateUnreadCount(data.groupId, (prev) => (prev || 0) + 1);
          }
        }
      });
    }
    
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up group socket');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, updateUnreadCount]);

  const joinGroup = useCallback((groupId) => {
    if (socketRef.current && userId) {
      console.log(`User ${userId} joining group: ${groupId}`);
      socketRef.current.emit('join_group', groupId);
    }
  }, [userId]);

  const leaveGroup = useCallback((groupId) => {
    // if (socketRef.current && userId) {
    //   console.log(`User ${userId} leaving group: ${groupId}`);
    //   socketRef.current.emit('leave_group', groupId);
    // }
  }, [userId]);

  const sendGroupMessage = useCallback((groupId, text, fileData = null, tempId = null) => {
    if (!socketRef.current || !userId) return null;
    
    // If no tempId provided, generate one
    if (!tempId) {
      tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    
    const messageData = {
      groupId,
      senderId: userId,
      text,
      tempId,
      ...fileData
    };
    
    socketRef.current.emit('send_group_message', messageData);
    
    return tempId;
  }, [userId]);

  const markGroupMessageAsRead = useCallback((messageId, groupId) => {
    if (socketRef.current && userId) {
      console.log(`Marking group message ${messageId} as read by ${userId}`);
      socketRef.current.emit('group_message_read', {
        messageId,
        userId,
        groupId
      });
    }
  }, [userId]);

  return {
    socket: socketRef.current,
    joinGroup,
    leaveGroup,
    sendGroupMessage,
    markGroupMessageAsRead
  };
};

export default useGroupSocket;