import { useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const useSocket = (userId, setUsers) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3000');

    if (userId) {
      //console.log(`User ${userId} connected to direct message socket`);
      socketRef.current.emit('user_connected', userId);

      // Listen for user status changes
      socketRef.current.on('user_status_change', ({ userId, online }) => {
        //console.log(`User ${userId} status changed to ${online ? 'online' : 'offline'}`);
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === userId ? { ...u, online } : u
          )
        );
      });

      // Listen for bulk status updates
      socketRef.current.on('users_status_update', (users) => {
        //console.log('Received users status update');
        setUsers(prev =>
          prev.map(u => {
            const updatedUser = users.find(user => user._id === u._id);
            return updatedUser ? { ...u, online: updatedUser.online } : u;
          })
        );
      });

      // Reconnect handler
      socketRef.current.on('connect', () => {
        //console.log(`Socket reconnected for user ${userId}`);
        socketRef.current.emit('user_connected', userId);
      });
    }

    // Cleanup function
    return () => {
      if (socketRef.current && userId) {
        //console.log(`User ${userId} disconnecting from socket`);
        socketRef.current.emit('user_disconnected', userId);
        socketRef.current.disconnect();
      }
    };
  }, [userId, setUsers]);

  const sendMessage = useCallback((receiverId, text, fileData = null) => {
    if (socketRef.current) {
      const messageData = {
        senderId: userId,
        receiverId,
        text,
        ...fileData
      };
      
      //console.log(`Sending direct message to ${receiverId}`);
      socketRef.current.emit('send_message', messageData);
    }
  }, [userId]);

  const markMessageAsRead = useCallback((messageId, senderId) => {
    if (socketRef.current) {
      //console.log(`Marking message ${messageId} as read`);
      socketRef.current.emit('message_read', {
        messageId,
        readBy: userId,
        senderId
      });
    }
  }, [userId]);

  return {
    socket: socketRef.current,
    sendMessage,
    markMessageAsRead
  };
};

export default useSocket;