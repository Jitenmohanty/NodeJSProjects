const socketIo = require("socket.io");

const initializeSocket = (server) => {
  const io = socketIo(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Set user online
    socket.on("setOnline", (userId) => {
      socket.join(userId);
      io.emit("userOnline", userId);
    });

    // Handle call initiation
    socket.on("callUser", (data) => {
      io.to(data.userToCall).emit("callIncoming", {
        signal: data.signalData,
        from: data.from,
      });
    });

    // Handle call acceptance
    socket.on("acceptCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = { initializeSocket };