// useSocket.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useSocket = (userId, setUsers) => {
  const socket = useRef();

  useEffect(() => {
    // Initialize socket connection
    socket.current = io('http://localhost:3000');

    if (userId) {
      socket.current.emit('user_connected', userId);

      // Listen for user status changes
      socket.current.on('user_status_change', ({ userId, online }) => {
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, online } : u
          )
        );
      });

      // Listen for bulk status updates
      socket.current.on('users_status_update', (users) => {
        setUsers(prev =>
          prev.map(u => {
            const updatedUser = users.find(user => user._id === u._id);
            return updatedUser ? { ...u, online: updatedUser.online } : u;
          })
        );
      });

      // Reconnect handler
      socket.current.on('connect', () => {
        socket.current.emit('user_connected', userId);
      });
    }

    // Cleanup function
    return () => {
      if (socket.current && userId) {
        socket.current.emit('user_disconnected', userId);
        socket.current.disconnect();
      }
    };
  }, [userId, setUsers]);

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