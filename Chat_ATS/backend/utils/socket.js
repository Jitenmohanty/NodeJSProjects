const socketio = require("socket.io");

let io;

const setupSocket = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("sendMessage", (data) => {
      const { receiverId, message } = data;
      io.to(receiverId).emit("receiveMessage", { senderId: socket.id, message });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket };