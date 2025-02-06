import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const ChatInterface = ({ setOpenChat, unreadMessages, setUnreadMessages }) => {
  const { user, fetchUsers, users, setUsers, socket } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial fetch of users and setup of socket listeners
  useEffect(() => {
    fetchUsers();
    
    if (!socket) return;

    // Re-emit user connected to ensure status is up to date
    if (user) {
      socket.emit('user_connected', user.id);
    }

    const handleStatusChange = ({ userId, online }) => {
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, online } : u
      ));
    };

    const handleReceiveMessage = (data) => {
      if (data.message.sender === selectedUser?._id) {
        setMessages(prev => [...prev, data.message]);
        setUnreadMessages(prev => ({
          ...prev,
          [selectedUser._id]: 0
        }));
      } else {
        setUnreadMessages(prev => ({
          ...prev,
          [data.message.sender]: (prev[data.message.sender] || 0) + 1
        }));
      }
    };

    socket.on('user_status_change', handleStatusChange);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('user_status_change', handleStatusChange);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, user, selectedUser]);

  // Fetch messages when selecting a user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/messages/${selectedUser._id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clear unread messages when selecting a user
  useEffect(() => {
    if (selectedUser) {
      setUnreadMessages(prev => ({
        ...prev,
        [selectedUser._id]: 0
      }));
    }
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !socket) return;
    
    try {
      socket.emit('send_message', {
        senderId: user.id,
        receiverId: selectedUser._id,
        text: message.trim()
      });

      setMessages(prev => [...prev, {
        _id: Date.now(),
        sender: user.id,
        receiver: selectedUser._id,
        text: message.trim(),
        timestamp: new Date().toISOString()
      }]);
      setMessage('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex justify-between items-center">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-white">
              {selectedUser ? selectedUser.name : 'Select a User'}
            </h2>
            {selectedUser && (
              <p className={`text-sm ${selectedUser.online ? "text-[#f3ef08]" : "text-gray-200"}`}>
                {selectedUser.online ? 'Online' : 'Offline'}
              </p>
            )}
          </div>
          
          <button 
            onClick={() => {
              if (selectedUser) {
                setSelectedUser(null);
              } else {
                setOpenChat(false);
              }
            }}
            className="text-white hover:text-gray-200 transition-colors cursor-pointer"
          >
            <X />
          </button>
        </div>

        {/* Content Area */}
        <div className="h-[500px] flex flex-col">
          {!selectedUser ? (
            // User List
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {users && users.map(u => (
                <div 
                  key={u._id} 
                  onClick={() => setSelectedUser(u)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-200 cursor-pointer border-b border-gray-200"
                >
                  {/* User Avatar with Status and Notification Badge */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {u.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      u.online ? 'bg-green-500' : 'bg-gray-400'
                    }`}></span>
                    {unreadMessages[u._id] > 0 && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadMessages[u._id]}
                      </div>
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{u.name}</h3>
                    <p className="text-sm text-gray-500">
                      {u.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Chat Area
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div 
                        key={msg._id}
                        className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === user.id 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === user.id ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form 
                onSubmit={handleSendMessage}
                className="p-4 bg-white border-t border-gray-200"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full px-4 py-2 border text-black border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;