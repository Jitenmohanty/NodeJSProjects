import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGroupSocket } from '../hooks/useGroupSocket';
import axios from 'axios';

const GroupChatInterface = ({ group, onBack }) => {
  const { user } = useAuth();
  const { socket, sendGroupMessage, markGroupMessageAsRead } = useGroupSocket(user?.id);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  console.log(group)

  useEffect(() => {
    if (socket) {
      socket.on('receive_group_message', ({ message }) => {
        setMessages(prev => [...prev, message]);
        markGroupMessageAsRead(message._id, group._id);
      });

      socket.on('group_message_status_update', ({ messageId, readBy }) => {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === messageId ? { ...msg, readBy } : msg
          )
        );
      });

      return () => {
        socket.off('receive_group_message');
        socket.off('group_message_status_update');
      };
    }
  }, [socket, group]);

  const fetchMessages = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/groups/${group._id}/messages`, {
        params: { page, limit: 20 }
      });

      if (response.data.length < 20) setHasMore(false);
      setMessages(prev => [...response.data, ...prev]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to fetch group messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [group]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      text: message.trim(),
      sender: user.id,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    sendGroupMessage(group._id, message.trim());
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-800 flex items-center">
        <button
          onClick={onBack}
          className="mr-2 text-white"
        >
          ←
        </button>
        <div>
          <h2 className="text-white font-medium">{group.name}</h2>
          <p className="text-gray-400 text-sm">{group.members.length} members</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`mb-4 ${msg.sender === user.id ? 'text-right' : ''}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                msg.sender === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-gray-800">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 bg-gray-700 text-white rounded-l"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};


export default GroupChatInterface;