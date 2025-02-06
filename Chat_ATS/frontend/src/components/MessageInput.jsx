import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react"; // Icon for emoji picker
import { useState } from "react";

const MessageInput = ({ message, setMessage, handleSendMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  return (
    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex items-center">
      {/* Emoji Picker Toggle */}
      <div className="relative">
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mr-2">
          <Smile className="text-gray-500 hover:text-blue-500" size={24} />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-10 left-0 bg-white shadow-lg border rounded-lg">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Text Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-full px-4 py-2 border text-black border-gray-300 focus:outline-none"
      />

      {/* Send Button */}
      <button type="submit" disabled={!message.trim()} className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
