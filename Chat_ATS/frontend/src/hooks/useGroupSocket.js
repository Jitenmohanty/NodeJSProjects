import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export const useGroupSocket = (userId) => {
  const socket = useRef();

  useEffect(() => {
    socket.current = io('http://localhost:3000');
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  const joinGroup = (groupId) => {
    if (socket.current) {
      socket.current.emit('join_group', groupId);
    }
  };

  const leaveGroup = (groupId) => {
    if (socket.current) {
      socket.current.emit('leave_group', groupId);
    }
  };

  const sendGroupMessage = (groupId, text, fileData = null) => {
    if (socket.current) {
      const messageData = {
        groupId,
        senderId: userId,
        text,
        ...fileData
      };
      socket.current.emit('send_group_message', messageData);
    }
  };

  const markGroupMessageAsRead = (messageId, groupId) => {
    if (socket.current) {
      socket.current.emit('group_message_read', {
        messageId,
        userId,
        groupId
      });
    }
  };

  return {
    socket: socket.current,
    joinGroup,
    leaveGroup,
    sendGroupMessage,
    markGroupMessageAsRead
  };
};
