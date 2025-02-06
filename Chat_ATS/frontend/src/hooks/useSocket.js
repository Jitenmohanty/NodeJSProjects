import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = ({ userId, onStatusChange, onMessageReceive }) => {
  const socket = useRef();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io('http://localhost:3000');

    // Set up connection event handlers
    socket.current.on('connect', () => {
      setIsConnected(true);
      if (userId) {
        socket.current.emit('user_connected', userId);
      }
    });

    socket.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Set up message handlers
    socket.current.on('receive_message', (data) => {
      if (onMessageReceive) {
        onMessageReceive(data);
      }
    });

    // Set up status change handlers
    socket.current.on('user_status_change', (data) => {
      if (onStatusChange) {
        onStatusChange(data);
      }
    });

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [userId, onMessageReceive, onStatusChange]);

  // Reconnect handler
  useEffect(() => {
    if (socket.current && userId) {
      const handleReconnect = () => {
        socket.current.emit('user_connected', userId);
      };

      socket.current.on('connect', handleReconnect);

      return () => {
        socket.current?.off('connect', handleReconnect);
      };
    }
  }, [userId]);

  const sendMessage = (receiverId, text) => {
    if (socket.current && isConnected) {
      socket.current.emit('send_message', {
        senderId: userId,
        receiverId,
        text
      });
      return true;
    }
    return false;
  };

  const connectUser = () => {
    if (socket.current && userId) {
      socket.current.emit('user_connected', userId);
    }
  };

  const disconnectUser = () => {
    if (socket.current && userId) {
      socket.current.emit('user_disconnected', userId);
    }
  };

  const startTyping = (receiverId) => {
    if (socket.current && isConnected) {
      socket.current.emit('typing', {
        senderId: userId,
        receiverId
      });
    }
  };

  return {
    socket: socket.current,
    isConnected,
    sendMessage,
    connectUser,
    disconnectUser,
    startTyping
  };
};

export default useSocket;