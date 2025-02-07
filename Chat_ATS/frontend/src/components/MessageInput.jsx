import { useRef, useState, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { FileIcon, Send, Smile } from "lucide-react";

const MessageInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  uploading,
}) => {
  const fileInputRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false); // 🔥 Close Emoji Picker after selection
  };

  // Close Emoji Picker when clicking outside
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
      className="p-4 bg-white border-t border-gray-200 flex items-center"
    >
      {/* Emoji Picker Toggle */}
      <div className="relative" ref={emojiPickerRef}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="mr-2 mt-1 "
        >
          <Smile className="text-gray-500 hover:text-blue-500" size={24} />
        </button>

        {showEmojiPicker && (
          <div
            className="absolute bottom-full left-0 mb-2 z-50 bg-white shadow-lg border rounded-lg p-2"
            style={{
              width: "260px",
              height: "280px",
              overflowY: "auto", // Enable scrolling
              overflowX: "hidden",
              borderRadius: "12px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <EmojiPicker className="text-sky-600" onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx"
      />

      {/* Text Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full px-4 py-2 border text-black border-gray-300 focus:outline-none"
      />

      {/* File Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="p-2 text-blue-500 hover:text-blue-600 focus:outline-none disabled:opacity-50"
      >
        <FileIcon className="w-6 h-6" />
      </button>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim()}
        className="bg-blue-500 text-white px-4 py-2 cursor-pointer rounded-full ml-2"
      >
        <Send  className="w-4 h-4 rotate-45"/>
      </button>
    </form>
  );
};

export default MessageInput;
