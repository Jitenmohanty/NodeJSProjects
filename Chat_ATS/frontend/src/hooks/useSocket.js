import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  const socket = useRef();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io('http://localhost:3000');

    // Connect and set online status when userId is available
    if (userId) {
      socket.current.emit('user_connected', userId);
    }

    // Cleanup function
    return () => {
      if (socket.current && userId) {
        socket.current.emit('user_disconnected', userId);
        socket.current.disconnect();
      }
    };
  }, [userId]); // Only re-run when userId changes

  const sendMessage = (receiverId, text, fileData = null) => {
    if (socket.current) {
      const messageData = {
        senderId: userId,
        receiverId,
        text,
        ...fileData
      };
      
      socket.current.emit('send_message', messageData);
    }
  };

  const markMessageAsRead = (messageId, senderId) => {
    if (socket.current) {
      socket.current.emit('message_read', {
        messageId,
        readBy: userId,
        senderId
      });
    }
  };

  return {
    socket: socket.current,
    sendMessage,
    markMessageAsRead
  };
};

export default useSocket;