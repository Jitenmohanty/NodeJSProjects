import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Paperclip, Send, Smile } from "lucide-react";
import { useTheme } from "../context/ThemeContex";
import { useChatBot } from "../context/BotContext";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  uploading,
  selectBot,
}) => {
  const { darkMode } = useTheme();
  const { sendMessageToBot } = useChatBot(); // Keep chatbot function
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle message submission with the event passed to handleSendMessage
  const onSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (selectBot) {
      sendMessageToBot(message); // Send message to chatbot
      setMessage(""); // Clear input after sending
    } else {
      handleSendMessage(e); // Pass the event to handleSendMessage
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`p-4 border-t flex items-center ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
      {/* Emoji Picker Button */}
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="mr-2 mt-1"
        >
          <Smile
            className={`hover:text-blue-500 ${
              darkMode ? "text-gray-300" : "text-gray-500"
            }`}
            size={24}
          />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            className={`absolute h-72 bottom-full left-0 mb-2 z-50 shadow-lg border rounded-lg p-2 overflow-y-hidden ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
          >
            <EmojiPicker
              emojiStyle="apple"
              height={700}
              width={280}
              onEmojiClick={handleEmojiClick}
              theme={darkMode ? "dark" : "light"}
              searchDisabled
              lazyLoadEmojis
              style={{ backgroundColor: darkMode ? "#2d3748" : "#ffffff" }}
            />
          </div>
        )}
      </div>

      {/* File Input (Hidden) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className={`flex-1 rounded-full px-4 py-2 border focus:outline-none ${
          darkMode
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />

      {/* File Upload Button (Hidden in Chatbot Mode) */}
      {!selectBot && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={`p-2 focus:outline-none disabled:opacity-50 ${
            darkMode
              ? "text-gray-300 hover:text-gray-400"
              : "text-blue-500 hover:text-blue-600"
          }`}
        >
          <Paperclip className="w-6 h-6 -rotate-45" />
        </button>
      )}

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim()}
        className={`px-4 py-2 cursor-pointer rounded-full ml-2 ${
          darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
        }`}
      >
        <Send className="w-4 h-4 rotate-45" />
      </button>
    </form>
  );
};

export default MessageInput;