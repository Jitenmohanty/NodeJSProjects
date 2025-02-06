import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId) => {
  const socket = useRef();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io('http://localhost:3000');

    // Connect user
    if (userId) {
      socket.current.emit('user_connected', userId);
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const sendMessage = (receiverId, text) => {
    if (socket.current) {
      socket.current.emit('send_message', {
        senderId: userId,
        receiverId,
        text
      });
    }
  };

  const startTyping = (receiverId) => {
    if (socket.current) {
      socket.current.emit('typing', {
        senderId: userId,
        receiverId
      });
    }
  };

  return {
    socket: socket.current,
    sendMessage,
    startTyping
  };
};

export default useSocket;