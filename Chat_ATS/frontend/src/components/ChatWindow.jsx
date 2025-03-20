import React from "react";
import ChatHeader from "./ChatHeader";
import UnifiedChatWindow from "./UnifiedChatWindow";
import MessageInput from "./MessageInput";
import image from "../assets/chatbg.jpg"

const ChatWindow = ({
  selectedUser,
  setSelectedUser,
  setOpenChat,
  selectedGroup,
  resetSelection,
  messages,
  loading,
  user,
  messagesEndRef,
  scrollTop,
  groupData,
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  uploading,
  notification,
  darkMode,
  handleScroll,
  loadingOlder,
  chatContainerRef
}) => {
  return (
    <div
      className={`w-3/4 h-full flex flex-col rounded-lg shadow-md transition-all ${
        darkMode ? " text-white" : " text-gray-900"
      } ${
        darkMode
          ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "text-gray-700 bg-gradient-to-br from-blue-200 via-white to-blue-100"
      }`}
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-6 p-4 rounded-lg shadow-lg border-l-4 w-[30%] ${
            darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-800"
          } ${
            notification.type === "group"
              ? "border-green-500"
              : "border-blue-500"
          }`}
        >
          <div className="font-semibold">{notification.sender}</div>
          <div className="text-sm truncate opacity-80">{notification.text}</div>
        </div>
      )}

      {/* Chat Header */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        setOpenChat={setOpenChat}
        group={selectedGroup}
        onBack={resetSelection}
      />

      {/* Chat Content with Stylish Scrollbar */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}
      >
        {!selectedUser && !selectedGroup ? (
          <div className="flex justify-center items-center h-full text-gray-500 opacity-75">
         <img className="object-contain" src={image} alt="image"/>
          </div>
        ) : (
          <UnifiedChatWindow
            messages={messages}
            loading={loading}
            loadingOlder={loadingOlder}
            user={user}
            messagesEndRef={messagesEndRef}
            scrollTop={scrollTop}
            isGroup={!!selectedGroup}
            groupMembers={groupData?.members || []}
            chatContainerRef={chatContainerRef}
            selectedUser={selectedUser}
          />
        )}
      </div>

      {/* Message Input */}
      {(selectedUser || selectedGroup) && (
        <div className=" dark:border-gray-700">
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            uploading={uploading}
          />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
