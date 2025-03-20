// socketHandler.js
import { User } from "../models/userSchema.js";
import { Message } from "../models/messageSchema.js";
import { GroupMessage } from "../models/groupMessageSchema.js";
import { Group } from "../models/groupSchema.js";

// Store connected users
const connectedUsers = new Map();

export const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_connected", async (userId) => {
      try {
        connectedUsers.set(userId, socket.id);
        await User.findByIdAndUpdate(userId, { online: true });
        io.emit("user_status_change", { userId, online: true });

        // Fetch and broadcast current online status of all users
        const users = await User.find({}).select("_id online");
        io.emit("users_status_update", users);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, text, fileUrl, fileName, fileType } = data;

        // Create and save the message
        const message = new Message({
          sender: senderId,
          receiver: receiverId,
          text: text || "",
          fileUrl,
          fileName,
          fileType,
          status: "sent",
        });

        await message.save();

        // Send to receiver if online
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          const sender = await User.findById(senderId).select("name");
          io.to(receiverSocketId).emit("receive_message", {
            message,
            sender,
          });

          // Update message status to delivered
          message.status = "delivered";
          await message.save();

          // Notify sender about delivery
          io.to(connectedUsers.get(senderId)).emit("message_status_update", {
            messageId: message._id,
            status: "delivered",
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("message_read", async ({ messageId, readBy, senderId }) => {
      try {
        const message = await Message.findById(messageId);
        if (
          message &&
          message.sender.toString() === senderId &&
          !message.readAt
        ) {
          message.status = "read";
          message.readAt = new Date();
          await message.save();

          const senderSocketId = connectedUsers.get(senderId);
          if (senderSocketId) {
            io.to(senderSocketId).emit("message_status_update", {
              messageId,
              status: "read",
              readAt: message.readAt,
            });
          }
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Group chat handlers
    socket.on("join_group", (groupId) => {
      socket.join(`group:${groupId}`);
    });

    socket.on("leave_group", (groupId) => {
      socket.leave(`group:${groupId}`);
    });

    socket.on("send_group_message", async (data) => {
      try {
        const { groupId, senderId, text, fileUrl, fileName, fileType } = data;

        const group = await Group.findById(groupId);
        if (!group || !group.members.includes(senderId)) {
          throw new Error("Not a member of this group");
        }

        // Create new message
        const message = new GroupMessage({
          group: groupId,
          sender: senderId,
          text: text || "",
          fileUrl,
          fileName,
          fileType,
          readBy: [{ user: senderId }], // Mark as read by sender
        });

        await message.save();

        // Populate sender info for the response
        const populatedMessage = await GroupMessage.findById(
          message._id
        ).populate("sender", "name email");

        // Send to all group members
        const onlineGroupMembers = group.members.filter(
          (memberId) =>
            memberId.toString() !== senderId.toString() &&
            connectedUsers.has(memberId.toString())
        );

        // Emit to the group channel for clients currently viewing the group
        io.to(`group:${groupId}`).emit("receive_group_message", {
          message: populatedMessage,
        });

        // Send individual notifications to online group members
        for (const memberId of onlineGroupMembers) {
          const memberSocketId = connectedUsers.get(memberId.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("group_message_notification", {
              messageId: message._id,
              groupId: groupId,
              sender: {
                _id: senderId,
                name: (await User.findById(senderId).select("name")).name,
              },
              text: text,
              timestamp: message.timestamp,
            });
          }
        }
      } catch (error) {
        console.error("Error sending group message:", error);
        socket.emit("group_message_error", { error: "Failed to send message" });
      }
    });

    socket.on("group_message_read", async ({ messageId, userId, groupId }) => {
      try {
        const message = await GroupMessage.findById(messageId);
        if (!message) {
          return;
        }

        // Check if user already read this message
        if (!message.readBy.some((read) => read.user.toString() === userId)) {
          // Add user to readBy array with timestamp
          message.readBy.push({ user: userId, readAt: new Date() });
          await message.save();

          // Notify group members about read status
          io.to(`group:${groupId}`).emit("group_message_status_update", {
            messageId,
            groupId,
            readBy: message.readBy,
            userId,
          });
        }
      } catch (error) {
        console.error("Error marking group message as read:", error);
      }
    });

    socket.on("user_disconnected", async (userId) => {
      try {
        connectedUsers.delete(userId);
        await User.findByIdAndUpdate(userId, { online: false });
        io.emit("user_status_change", { userId, online: false });
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        let disconnectedUserId = null;
        for (const [userId, socketId] of connectedUsers.entries()) {
          if (socketId === socket.id) {
            disconnectedUserId = userId;
            connectedUsers.delete(userId);
            break;
          }
        }

        if (disconnectedUserId) {
          await User.findByIdAndUpdate(disconnectedUserId, { online: false });
          io.emit("user_status_change", {
            userId: disconnectedUserId,
            online: false,
          });
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
    });
  });

  // Export utility function to get connected users
  return {
    getConnectedUsers: () => connectedUsers
  };
};