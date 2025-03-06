import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";

const App = () => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [callActive, setCallActive] = useState(false);
    const localAudioRef = useRef();
    const remoteAudioRef = useRef();
    const peerInstance = useRef(null);

    useEffect(() => {
        // Connect to the PeerJS server
        const peer = new Peer(undefined, {
            host: "localhost",
            port: 5000,
            path: "/peerjs"
        });

        peer.on("open", (id) => {
            setPeerId(id);
            console.log("My Peer ID:", id);
        });

        peer.on("call", (call) => {
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                localAudioRef.current.srcObject = stream;
                call.answer(stream); // Answer the call
                call.on("stream", (remoteStream) => {
                    remoteAudioRef.current.srcObject = remoteStream;
                    setCallActive(true);
                });
            });
        });

        peerInstance.current = peer;
    }, []);

    const startCall = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            localAudioRef.current.srcObject = stream;
            const call = peerInstance.current.call(remotePeerId, stream);

            call.on("stream", (remoteStream) => {
                remoteAudioRef.current.srcObject = remoteStream;
                setCallActive(true);
            });
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>PeerJS Voice Call</h1>
            <p>Your Peer ID: <strong>{peerId}</strong></p>
            <input
                type="text"
                placeholder="Enter Remote Peer ID"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
            />
            <button onClick={startCall}>Call</button>
            
            <div style={{ marginTop: "20px" }}>
                <h3>Local Audio</h3>
                <audio ref={localAudioRef} autoPlay playsInline controls />
            </div>

            <div style={{ marginTop: "20px" }}>
                <h3>Remote Audio</h3>
                <audio ref={remoteAudioRef} autoPlay playsInline controls />
            </div>

            {callActive && <h3>Call in Progress...</h3>}
        </div>
    );
};

export default App;
