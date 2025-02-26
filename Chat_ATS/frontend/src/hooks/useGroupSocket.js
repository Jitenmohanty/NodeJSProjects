import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

export const useGroupSocket = (userId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000');
    
    if (userId) {
      console.log(`User ${userId} connected to group socket`);
    }

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log(`Disconnecting group socket for user ${userId}`);
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const joinGroup = useCallback((groupId) => {
    if (socketRef.current) {
      console.log(`User ${userId} joining group: ${groupId}`);
      socketRef.current.emit('join_group', groupId);
    }
  }, [userId]);

  const leaveGroup = useCallback((groupId) => {
    if (socketRef.current) {
      console.log(`User ${userId} leaving group: ${groupId}`);
      socketRef.current.emit('leave_group', groupId);
    }
  }, [userId]);

  const sendGroupMessage = useCallback((groupId, text, fileData = null) => {
    if (socketRef.current) {
      const messageData = {
        groupId,
        senderId: userId,
        text,
        ...fileData
      };
      console.log('Sending group message:', messageData);
      socketRef.current.emit('send_group_message', messageData);
    }
  }, [userId]);

  const markGroupMessageAsRead = useCallback((messageId, groupId) => {
    if (socketRef.current) {
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