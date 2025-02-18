import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { Theme } from 'emoji-picker-react';
import { FileIcon, Send, Smile } from "lucide-react";
import { useTheme } from "../context/ThemeContex";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  uploading,
}) => {
  const { darkMode } = useTheme();
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

  return (
    <form
      onSubmit={handleSendMessage}
      className={`p-4 border-t flex items-center ${
        darkMode
          ? "bg-gray-900 border-gray-700 text-white"
          : "bg-white border-gray-200 text-black"
      }`}
    >
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

        {showEmojiPicker && (
          <div
            className={`absolute h-72  bottom-full left-0 mb-2 z-50 shadow-lg border rounded-lg p-2 overflow-y-hidden ${
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
              theme={darkMode?"dark":"light"}
              searchDisabled
              lazyLoadEmojis
              style={{ backgroundColor: darkMode ? "#2d3748" : "#ffffff" }} // Using HEX color codes for Tailwind colors
            />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

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
        <FileIcon className="w-6 h-6" />
      </button>

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
