import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const CallingSystem = ({ socket, callerId }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [peerId, setPeerId] = useState("");
  const peerInstance = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // Initialize PeerJS
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("My peer ID is: " + id);
    });

    // Handle incoming calls
    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Answer the call
          call.answer(stream);

          // Handle remote stream
          call.on("stream", (remoteStream) => {
            setRemoteStream(remoteStream);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });

          setCallInProgress(true);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    });

    peerInstance.current = peer;

    // Cleanup on unmount
    return () => {
      if (peerInstance.current) {
        peerInstance.current.destroy();
      }
    };
  }, []);

  const callUser = (userId) => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((stream) => {
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initiate the call
        const call = peerInstance.current.call(userId, stream);

        // Handle remote stream
        call.on("stream", (remoteStream) => {
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        setCallInProgress(true);
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallInProgress(false);
  };

  return (
    <div>
      <h2>Calling System</h2>
      <div>
        <h3>My Peer ID: {peerId}</h3>
        <div>
          <h4>Local Stream</h4>
          <audio ref={localVideoRef} autoPlay muted />
        </div>
        <div>
          <h4>Remote Stream</h4>
          <audio ref={remoteVideoRef} autoPlay />
        </div>
      </div>
      <button onClick={() => callUser(callerId)} disabled={callInProgress}>
        Call User
      </button>
      <button onClick={endCall} disabled={!callInProgress}>
        End Call
      </button>
    </div>
  );
};

export default CallingSystem;