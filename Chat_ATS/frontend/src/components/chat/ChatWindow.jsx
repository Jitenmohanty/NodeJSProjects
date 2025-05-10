// import React, { useEffect, useState, useCallback, useRef } from "react";
// import ChatHeader from "./ChatHeader";
// import UnifiedChatWindow from "./UnifiedChatWindow";
// import MessageInput from "./MessageInput";
// import image from "../../assets/chatbg.jpg";
// import { useChatBot } from "../../context/BotContext";
// import BotChatWindow from "../bot/BotChatWindow";
// import { useAuth } from "../../context/AuthContext";
// import VideoCallModal from "./VideoCallModal";
// import { toast } from "react-toastify";

// const ChatWindow = ({
//   selectedUser,
//   setSelectedUser,
//   selectedGroup,
//   resetSelection,
//   messages,
//   loading,
//   user,
//   messagesEndRef,
//   scrollTop,
//   groupData,
//   message,
//   setMessage,
//   handleSendMessage,
//   handleFileUpload,
//   uploading,
//   notification,
//   darkMode,
//   handleScroll,
//   loadingOlder,
//   chatContainerRef,
//   selectBot,
// }) => {
//   const { botMessages, fetchChatHistory } = useChatBot();
//   const { socket } = useAuth();

//   console.log(socket,"socket")
  
//   const [callState, setCallState] = useState({
//     isOpen: false,
//     isIncoming: false,
//     callerName: "",
//     localStream: null,
//     remoteStream: null,
//     roomId: null,
//     callerId: null
//   });
  
//   const [peerConnection, setPeerConnection] = useState(null);
  
//   // Clean up resources on unmount
//   useEffect(() => {
//     return () => {
//       if (peerConnection) {
//         peerConnection.close();
//       }
//       if (callState.localStream) {
//         callState.localStream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [peerConnection, callState.localStream]);

//   // Handle incoming call events
//   useEffect(() => {
//     if (!socket) return;

//     const handleIncomingCall = ({ caller, callerName, roomId }) => {
//       setCallState(prev => ({
//         ...prev,
//         isOpen: true,
//         isIncoming: true,
//         callerName,
//         callerId: caller,
//         roomId
//       }));
//     };

//     socket.on('incoming_video_call', handleIncomingCall);
    
//     return () => {
//       socket.off('incoming_video_call', handleIncomingCall);
//     };
//   }, [socket]);

//   // Handle WebRTC signaling events (offer, answer, ICE candidates)
//   useEffect(() => {
//     if (!socket) return;

//     const handleOffer = async ({ offer, roomId, caller }) => {
//       console.log('Received offer', roomId);
      
//       if (!callState.isIncoming) return;
      
//       try {
//         // Setup peer connection
//         const pc = new RTCPeerConnection({
//           iceServers: [
//             { urls: 'stun:stun.l.google.com:19302' }
//           ]
//         });
        
//         // Add handlers
//         pc.onicecandidate = (event) => {
//           if (event.candidate) {
//             socket.emit('ice_candidate', {
//               candidate: event.candidate,
//               roomId,
//               targetUser: caller
//             });
//           }
//         };
        
//         pc.ontrack = (event) => {
//           setCallState(prev => ({
//             ...prev,
//             remoteStream: event.streams[0]
//           }));
//         };
        
//         // Set the remote description (the caller's offer)
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
        
//         // If local stream exists, add tracks
//         if (callState.localStream) {
//           callState.localStream.getTracks().forEach(track => {
//             pc.addTrack(track, callState.localStream);
//           });
//         }
        
//         // Create and send answer
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
        
//         socket.emit('answer', {
//           answer,
//           roomId,
//           targetUser: caller
//         });
        
//         setPeerConnection(pc);
//       } catch (err) {
//         console.error('Error handling offer:', err);
//         endCall();
//       }
//     };

//     const handleAnswer = async ({ answer, roomId }) => {
//       console.log('Received answer', roomId);
      
//       if (callState.isIncoming || !peerConnection) return;
      
//       try {
//         await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (err) {
//         console.error('Error setting remote description:', err);
//         endCall();
//       }
//     };

//     const handleIceCandidate = async ({ candidate, roomId }) => {
//       if (!peerConnection || !candidate) return;
      
//       try {
//         await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error('Error adding ICE candidate:', err);
//       }
//     };

//     const handleCallEnded = () => {
//       toast.info('Call ended');
//       endCall();
//     };
    
//     const handleCallRejected = () => {
//       toast.info('Call rejected');
//       endCall();
//     };

//     socket.on('offer', handleOffer);
//     socket.on('answer', handleAnswer);
//     socket.on('ice_candidate', handleIceCandidate);
//     socket.on('video_call_ended', handleCallEnded);
//     socket.on('video_call_rejected', handleCallRejected);

//     return () => {
//       socket.off('offer', handleOffer);
//       socket.off('answer', handleAnswer);
//       socket.off('ice_candidate', handleIceCandidate);
//       socket.off('video_call_ended', handleCallEnded);
//       socket.off('video_call_rejected', handleCallRejected);
//     };
//   }, [socket, peerConnection, callState.isIncoming, callState.localStream]);

//   // Initiate a call
//   const initiateCall = async () => {
//     if (!selectedUser) return;
    
//     try {
//       // Get media stream first
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       // Create a unique room ID
//       const roomId = `video_call_${user._id}_${selectedUser._id}_${Date.now()}`;
      
//       // Update state with local stream
//       setCallState(prev => ({
//         ...prev,
//         isOpen: true,
//         isIncoming: false,
//         callerName: user.name,
//         localStream: stream,
//         roomId
//       }));
      
//       // Create peer connection
//       const pc = new RTCPeerConnection({
//         iceServers: [
//           { urls: 'stun:stun.l.google.com:19302' }
//         ]
//       });
      
//       // Add tracks to peer connection
//       stream.getTracks().forEach(track => {
//         pc.addTrack(track, stream);
//       });
      
//       // Handle ICE candidates
//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           socket.emit('ice_candidate', {
//             candidate: event.candidate,
//             roomId,
//             targetUser: selectedUser._id
//           });
//         }
//       };
      
//       // Handle remote tracks
//       pc.ontrack = (event) => {
//         setCallState(prev => ({
//           ...prev,
//           remoteStream: event.streams[0]
//         }));
//       };
      
//       // Create offer
//       const offer = await pc.createOffer();
//       await pc.setLocalDescription(offer);
      
//       // Store peer connection in state
//       setPeerConnection(pc);
      
//       // Emit call initiation to server
//       socket.emit('initiate_video_call', {
//         caller: user._id,
//         callee: selectedUser._id,
//         callerName: user.name,
//         roomId
//       });
      
//       // Send offer to callee
//       socket.emit('offer', {
//         offer,
//         roomId,
//         targetUser: selectedUser._id
//       });
      
//     } catch (err) {
//       console.error('Error initiating call:', err);
//       toast.error('Could not access camera/microphone');
//       endCall();
//     }
//   };
  
//   // End the call and clean up resources
//   const endCall = () => {
//     // Close peer connection
//     if (peerConnection) {
//       peerConnection.close();
//       setPeerConnection(null);
//     }
    
//     // Stop all tracks in local stream
//     if (callState.localStream) {
//       callState.localStream.getTracks().forEach(track => track.stop());
//     }
    
//     // Emit end call event if we have necessary info
//     if (socket && callState.roomId) {
//       socket.emit('end_video_call', {
//         caller: user._id,
//         callee: callState.callerId || selectedUser?._id,
//         roomId: callState.roomId
//       });
//     }
    
//     // Reset call state
//     setCallState({
//       isOpen: false,
//       isIncoming: false,
//       callerName: "",
//       localStream: null,
//       remoteStream: null,
//       roomId: null,
//       callerId: null
//     });
//   };
  
//   // Accept an incoming call
//   const acceptCall = async () => {
//     try {
//       // Get user media
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       // Update state with local stream and move to connected state
//       setCallState(prev => ({
//         ...prev,
//         localStream: stream,
//         isIncoming: false  // No longer in incoming state
//       }));
      
//       // Notify server that call was accepted
//       socket.emit('accept_video_call', {
//         caller: callState.callerId,
//         callee: user._id,
//         roomId: callState.roomId
//       });
      
//     } catch (err) {
//       console.error('Error accepting call:', err);
//       toast.error('Could not access camera/microphone');
//       endCall();
//     }
//   };
  
//   // Reject an incoming call
//   const rejectCall = () => {
//     socket.emit('reject_video_call', {
//       caller: callState.callerId,
//       callee: user._id,
//       roomId: callState.roomId
//     });
    
//     endCall();
//   };

//   return (
//     <div
//       className={`w-3/4 h-full flex flex-col rounded-lg shadow-md transition-all ${
//         darkMode ? " text-white" : " text-gray-900"
//       } ${
//         darkMode
//           ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
//           : "text-gray-700 bg-gradient-to-bl from-blue-200 via-white to-blue-100"
//       }`}
//     >
//       {/* Notification */}
//       {notification && (
//         <div
//           className={`fixed top-4 left-6 p-4 rounded-lg shadow-lg border-l-4 w-[30%] ${
//             darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-800"
//           } ${
//             notification.type === "group"
//               ? "border-green-500"
//               : "border-blue-500"
//           }`}
//         >
//           <div className="font-semibold">{notification.sender}</div>
//           <div className="text-sm truncate opacity-80">{notification.text}</div>
//         </div>
//       )}

//       {/* Chat Header */}
//       <ChatHeader
//         selectedUser={selectedUser}
//         setSelectedUser={setSelectedUser}
//         group={selectedGroup}
//         onBack={resetSelection}
//         selectBot={selectBot}
//         initiateCall={initiateCall}
//       />

//       {/* Chat Content */}
//       <div
//         className="flex-1 overflow-y-auto custom-scrollbar"
//         onScroll={handleScroll}
//       >
//         {!selectedUser && !selectedGroup && !selectBot ? (
//           <div className="flex justify-center items-center h-full bg-black text-gray-500 opacity-75">
//             <img className="object-contain h-[40vw]" src={image} alt="image" />
//           </div>
//         ) : (
//           <UnifiedChatWindow
//             messages={messages}
//             loading={loading}
//             loadingOlder={loadingOlder}
//             user={user}
//             messagesEndRef={messagesEndRef}
//             scrollTop={scrollTop}
//             isGroup={!!selectedGroup}
//             groupMembers={groupData?.members || []}
//             chatContainerRef={chatContainerRef}
//             selectedUser={selectedUser}
//             selectBot={selectBot}
//           />
//         )}
//       </div>

//       {selectBot && (
//         <div className="dark:border-gray-700">
//           <BotChatWindow botMessages={botMessages} selectBot={selectBot} />
//         </div>
//       )}

//       {/* Message Input */}
//       {(selectedUser || selectedGroup || selectBot) && (
//         <div className="dark:border-gray-700">
//           <MessageInput
//             message={message}
//             setMessage={setMessage}
//             handleSendMessage={handleSendMessage}
//             handleFileUpload={handleFileUpload}
//             uploading={uploading}
//             selectBot={selectBot}
//           />
//         </div>
//       )}

// <VideoCallModal
//         isOpen={callState.isOpen}
//         isIncoming={callState.isIncoming}
//         callerName={callState.callerName}
//         localStream={callState.localStream}
//         remoteStream={callState.remoteStream}
//         onAccept={acceptCall}
//         onReject={rejectCall}
//         onEndCall={endCall}
//       />
//     </div>
//   );
// };

// export default ChatWindow;


import React, { useEffect, useState, useCallback, useRef } from "react";
import ChatHeader from "./ChatHeader";
import UnifiedChatWindow from "./UnifiedChatWindow";
import MessageInput from "./MessageInput";
import image from "../../assets/chatbg.jpg";
import { useChatBot } from "../../context/BotContext";
import BotChatWindow from "../bot/BotChatWindow";
import { useAuth } from "../../context/AuthContext";
import VideoCallModal from "./VideoCallModal";
import { toast } from "react-toastify";

// WebRTC configuration - Using Google's STUN servers
const RTCConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
  ]
};

const ChatWindow = ({
  selectedUser,
  setSelectedUser,
  selectedGroup,
  resetSelection,
  messages,
  loading,
  user,
  messagesEndRef,
  scrollTop,
  groupData,
  message,
  setMessage,
  handleSendMessage,
  handleFileUpload,
  uploading,
  notification,
  darkMode,
  handleScroll,
  loadingOlder,
  chatContainerRef,
  selectBot,
}) => {
  const { botMessages, fetchChatHistory } = useChatBot();
  const { socket } = useAuth();
  
  // WebRTC related refs to persist across renders
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  
  // Call state management
  const [callState, setCallState] = useState({
    isOpen: false,
    isIncoming: false,
    callerName: "",
    localStream: null,
    remoteStream: null,
    roomId: null,
    callerId: null,
    connectionState: 'new', // Track connection state
    audioEnabled: true,
    videoEnabled: true
  });
  
  // Debug logging for WebRTC connection state changes
  const logConnectionStateChange = (state) => {
    console.log(`WebRTC Connection State: ${state}`);
    setCallState(prev => ({
      ...prev,
      connectionState: state
    }));
  };

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      cleanupMediaResources();
    };
  }, []);

  // Function to clean up media resources
  const cleanupMediaResources = () => {
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop all tracks in local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Update state
    setCallState(prev => ({
      ...prev,
      localStream: null,
      remoteStream: null
    }));
  };

  // Handle incoming call events
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ caller, callerName, roomId }) => {
      console.log(`Incoming call from ${callerName} (${caller}), room: ${roomId}`);
      
      setCallState(prev => ({
        ...prev,
        isOpen: true,
        isIncoming: true,
        callerName,
        callerId: caller,
        roomId,
        connectionState: 'incoming'
      }));
    };

    const handleCallerUnavailable = () => {
      toast.error('User is unavailable for call');
      endCall();
    };

    socket.on('incoming_video_call', handleIncomingCall);
    socket.on('callee_unavailable', handleCallerUnavailable);
    
    return () => {
      socket.off('incoming_video_call', handleIncomingCall);
      socket.off('callee_unavailable', handleCallerUnavailable);
    };
  }, [socket]);

  // Handle WebRTC signaling events (offer, answer, ICE candidates)
  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ offer, roomId, caller }) => {
      console.log('Received offer', roomId);
      
      if (!callState.isIncoming) return;
      
      try {
        // If accepting the call, this will be handled in acceptCall()
        // Just store the offer data for now
        setCallState(prev => ({
          ...prev,
          pendingOffer: offer,
          pendingCaller: caller
        }));
      } catch (err) {
        console.error('Error handling offer:', err);
        endCall();
      }
    };

    const handleAnswer = async ({ answer, roomId }) => {
      console.log('Received answer', roomId);
      
      if (callState.isIncoming || !peerConnectionRef.current) return;
      
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        logConnectionStateChange('connecting');
      } catch (err) {
        console.error('Error setting remote description:', err);
        endCall();
      }
    };

    const handleIceCandidate = async ({ candidate, roomId }) => {
      if (!peerConnectionRef.current || !candidate) return;
      
      try {
        console.log('Adding ICE candidate');
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    };

    const handleCallAccepted = ({ roomId }) => {
      console.log('Call was accepted, room:', roomId);
      toast.success('Call accepted');
      
      // Update call state to reflect that we're connecting
      setCallState(prev => ({
        ...prev,
        connectionState: 'connecting'
      }));
    };

    const handleCallEnded = () => {
      toast.info('Call ended');
      endCall();
    };
    
    const handleCallRejected = () => {
      toast.info('Call rejected');
      endCall();
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice_candidate', handleIceCandidate);
    socket.on('video_call_accepted', handleCallAccepted);
    socket.on('video_call_ended', handleCallEnded);
    socket.on('video_call_rejected', handleCallRejected);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice_candidate', handleIceCandidate);
      socket.off('video_call_accepted', handleCallAccepted);
      socket.off('video_call_ended', handleCallEnded);
      socket.off('video_call_rejected', handleCallRejected);
    };
  }, [socket, callState.isIncoming]);

  // Setup peer connection with proper event handlers
  const setupPeerConnection = () => {
    const pc = new RTCPeerConnection(RTCConfig);
    
    // Connection state change monitoring
    pc.onconnectionstatechange = (event) => {
      logConnectionStateChange(pc.connectionState);
    };
    
    // ICE connection state monitoring
    pc.oniceconnectionstatechange = (event) => {
      console.log(`ICE Connection State: ${pc.iceConnectionState}`);
    };
    
    // ICE gathering state monitoring
    pc.onicegatheringstatechange = (event) => {
      console.log(`ICE Gathering State: ${pc.iceGatheringState}`);
    };
    
    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate');
        socket.emit('ice_candidate', {
          candidate: event.candidate,
          roomId: callState.roomId,
          targetUser: callState.isIncoming ? callState.callerId : selectedUser._id
        });
      }
    };
    
    // Handle remote tracks
    pc.ontrack = (event) => {
      console.log('Received remote stream', event.streams[0]);
      setCallState(prev => ({
        ...prev,
        remoteStream: event.streams[0],
        connectionState: 'connected'
      }));
    };
    
    peerConnectionRef.current = pc;
    return pc;
  };

  // Initiate a call
  const initiateCall = async () => {
    if (!selectedUser || !socket) {
      toast.error('Cannot initiate call at this time');
      return;
    }
    
    try {
      // Get media stream with explicit constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      // Store stream in ref for cleanup
      localStreamRef.current = stream;
      
      // Create a unique room ID
      const roomId = `video_call_${user._id}_${selectedUser._id}_${Date.now()}`;
      
      // Update state with local stream
      setCallState(prev => ({
        ...prev,
        isOpen: true,
        isIncoming: false,
        callerName: user.name,
        localStream: stream,
        roomId,
        connectionState: 'calling'
      }));
      
      // Create peer connection
      const pc = setupPeerConnection();
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        pc.addTrack(track, stream);
      });
      
      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      console.log('Setting local description (offer)');
      await pc.setLocalDescription(offer);
      
      // Emit call initiation to server
      socket.emit('initiate_video_call', {
        caller: user._id,
        callee: selectedUser._id,
        callerName: user.name,
        roomId
      });
      
      // Send offer to callee
      socket.emit('offer', {
        offer,
        roomId,
        targetUser: selectedUser._id
      });
      
    } catch (err) {
      console.error('Error initiating call:', err);
      toast.error('Could not access camera/microphone');
      endCall();
    }
  };
  
  // End the call and clean up resources
  const endCall = () => {
    // Emit end call event if we have necessary info
    if (socket && callState.roomId) {
      socket.emit('end_video_call', {
        caller: user._id,
        callee: callState.callerId || selectedUser?._id,
        roomId: callState.roomId
      });
    }
    
    // Clean up resources
    cleanupMediaResources();
    
    // Reset call state
    setCallState({
      isOpen: false,
      isIncoming: false,
      callerName: "",
      localStream: null,
      remoteStream: null,
      roomId: null,
      callerId: null,
      connectionState: 'new',
      audioEnabled: true,
      videoEnabled: true,
      pendingOffer: null,
      pendingCaller: null
    });
  };
  
  // Accept an incoming call
  const acceptCall = async () => {
    try {
      // First get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      // Store stream for cleanup
      localStreamRef.current = stream;
      
      // Create peer connection
      const pc = setupPeerConnection();
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        pc.addTrack(track, stream);
      });
      
      // Handle the stored offer if we have one
      if (callState.pendingOffer && callState.pendingCaller) {
        console.log('Setting remote description (from pending offer)');
        await pc.setRemoteDescription(new RTCSessionDescription(callState.pendingOffer));
        
        // Create answer
        console.log('Creating answer');
        const answer = await pc.createAnswer();
        
        console.log('Setting local description (answer)');
        await pc.setLocalDescription(answer);
        
        // Send answer to caller
        socket.emit('answer', {
          answer,
          roomId: callState.roomId,
          targetUser: callState.pendingCaller
        });
      }
      
      // Update state with local stream
      setCallState(prev => ({
        ...prev,
        localStream: stream,
        isIncoming: false,  // No longer in incoming state
        connectionState: 'connecting',
        pendingOffer: null,
        pendingCaller: null
      }));
      
      // Notify server that call was accepted
      socket.emit('accept_video_call', {
        caller: callState.callerId,
        callee: user._id,
        roomId: callState.roomId
      });
      
    } catch (err) {
      console.error('Error accepting call:', err);
      toast.error('Could not access camera/microphone');
      endCall();
    }
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    socket.emit('reject_video_call', {
      caller: callState.callerId,
      callee: user._id,
      roomId: callState.roomId
    });
    
    endCall();
  };
  
  // Toggle audio mute
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState(prev => ({
          ...prev,
          audioEnabled: audioTrack.enabled
        }));
      }
    }
  };
  
  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState(prev => ({
          ...prev,
          videoEnabled: videoTrack.enabled
        }));
      }
    }
  };

  return (
    <div
      className={`w-3/4 h-full flex flex-col rounded-lg shadow-md transition-all ${
        darkMode ? " text-white" : " text-gray-900"
      } ${
        darkMode
          ? "text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "text-gray-700 bg-gradient-to-bl from-blue-200 via-white to-blue-100"
      }`}
    >
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 left-6 p-4 rounded-lg shadow-lg border-l-4 w-[30%] ${
            darkMode ? "bg-gray-600 text-white" : "bg-white text-gray-800"
          } ${
            notification.type === "group"
              ? "border-green-500"
              : "border-blue-500"
          }`}
        >
          <div className="font-semibold">{notification.sender}</div>
          <div className="text-sm truncate opacity-80">{notification.text}</div>
        </div>
      )}

      {/* Chat Header */}
      <ChatHeader
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        group={selectedGroup}
        onBack={resetSelection}
        selectBot={selectBot}
        initiateCall={initiateCall}
      />

      {/* Chat Content */}
      <div
        className="flex-1 overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}
      >
        {!selectedUser && !selectedGroup && !selectBot ? (
          <div className="flex justify-center items-center h-full bg-black text-gray-500 opacity-75">
            <img className="object-contain h-[40vw]" src={image} alt="image" />
          </div>
        ) : (
          <UnifiedChatWindow
            messages={messages}
            loading={loading}
            loadingOlder={loadingOlder}
            user={user}
            messagesEndRef={messagesEndRef}
            scrollTop={scrollTop}
            isGroup={!!selectedGroup}
            groupMembers={groupData?.members || []}
            chatContainerRef={chatContainerRef}
            selectedUser={selectedUser}
            selectBot={selectBot}
          />
        )}
      </div>

      {selectBot && (
        <div className="dark:border-gray-700">
          <BotChatWindow botMessages={botMessages} selectBot={selectBot} />
        </div>
      )}

      {/* Message Input */}
      {(selectedUser || selectedGroup || selectBot) && (
        <div className="dark:border-gray-700">
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            handleFileUpload={handleFileUpload}
            uploading={uploading}
            selectBot={selectBot}
          />
        </div>
      )}

      <VideoCallModal
        isOpen={callState.isOpen}
        isIncoming={callState.isIncoming}
        callerName={callState.callerName}
        localStream={callState.localStream}
        remoteStream={callState.remoteStream}
        connectionState={callState.connectionState}
        audioEnabled={callState.audioEnabled}
        videoEnabled={callState.videoEnabled}
        onAccept={acceptCall}
        onReject={rejectCall}
        onEndCall={endCall}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
      />
    </div>
  );
};

export default ChatWindow;