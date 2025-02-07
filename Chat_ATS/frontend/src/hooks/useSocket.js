import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    if (userId) {
      socket.current.emit('user_connected', userId);
    }

    return () => {
      if (socket.current) {
        socket.current.emit('user_disconnected', userId);
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const sendMessage = (receiverId, text, fileData = null) => {
    if (socket.current) {
      const messageId = Date.now().toString();
      const messageData = {
        messageId,
        senderId: userId,
        receiverId,
        text,
        ...fileData
      };
      
      socket.current.emit('send_message', messageData);
      return messageId;
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