import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useGroupSocket = (userId) => {
  const socketRef = useRef(null);
  
  useEffect(() => {
    if (!userId) return;
    
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000', {
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
    }
    
    return () => {
      if (socketRef.current) {
        console.log('Cleaning up group socket');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);

  const joinGroup = useCallback((groupId) => {
    if (socketRef.current && userId) {
      console.log(`User ${userId} joining group: ${groupId}`);
      socketRef.current.emit('join_group', groupId);
    }
  }, [userId]);

  const leaveGroup = useCallback((groupId) => {
    if (socketRef.current && userId) {
      console.log(`User ${userId} leaving group: ${groupId}`);
      socketRef.current.emit('leave_group', groupId);
    }
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
      tempId, // Send tempId to server
      ...fileData
    };
    
    console.log('Sending group message:', messageData);
    socketRef.current.emit('send_group_message', messageData);
    
    // Return the tempId so the component can use it
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