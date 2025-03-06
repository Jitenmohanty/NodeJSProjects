import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CallingSystem from "../components/CallingSystem";

const socket = io("http://localhost:5000");

const Home = ({ user }) => {
  const [callerId, setCallerId] = useState("");

  useEffect(() => {
    if (user) {
      socket.emit("setOnline", user.userId);
    }
  }, [user]);

  return (
    <div>
      <h1>Welcome, {user?.username}</h1>
      <CallingSystem socket={socket} callerId={callerId} />
    </div>
  );
};

export default Home;