const express = require("express");
const { ExpressPeerServer } = require("peer");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());

// Setup PeerJS server
const peerServer = ExpressPeerServer(server, {
    debug: true
});

// Use PeerJS server at /peerjs route
app.use("/peerjs", peerServer);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
