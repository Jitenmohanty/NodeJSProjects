// import React, { useEffect, useRef } from "react";

// const VideoCallModal = ({
//   isOpen,
//   isIncoming,
//   callerName,
//   localStream,
//   remoteStream,
//   onAccept,
//   onReject,
//   onEndCall,
// }) => {
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   // Handle video streams when they change
//   useEffect(() => {
//     if (localVideoRef.current && localStream) {
//       localVideoRef.current.srcObject = localStream;
//     }
    
//     if (remoteVideoRef.current && remoteStream) {
//       remoteVideoRef.current.srcObject = remoteStream;
//     }
//   }, [localStream, remoteStream]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-4xl w-full">
//         <div className="p-4 border-b border-gray-700 flex justify-between items-center">
//           <h3 className="text-xl font-medium text-white">
//             {isIncoming && !localStream 
//               ? `Incoming call from ${callerName || "Unknown"}`
//               : "Video Call"}
//           </h3>
//           <button
//             onClick={onEndCall}
//             className="text-gray-300 hover:text-white"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>

//         <div className="p-6">
//           {/* Show incoming call UI or actual video call UI */}
//           {isIncoming && !localStream ? (
//             <div className="text-center">
//               <div className="animate-pulse mb-4">
//                 <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-12 w-12 text-white"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <p className="text-white text-lg mb-6">
//                 {callerName || "Someone"} is calling you...
//               </p>
//               <div className="flex justify-center space-x-4">
//                 <button
//                   onClick={onAccept}
//                   className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full flex items-center"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                     />
//                   </svg>
//                   Accept
//                 </button>
//                 <button
//                   onClick={onReject}
//                   className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 8l4-4m0 0l-4-4m4 4H8m10 10L4 4"
//                     />
//                   </svg>
//                   Decline
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               {/* Main video area - display remote video */}
//               <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
//                 {remoteStream ? (
//                   <video
//                     ref={remoteVideoRef}
//                     autoPlay
//                     playsInline
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center">
//                     <p className="text-gray-400">Connecting to remote video...</p>
//                   </div>
//                 )}
//               </div>

//               {/* Local video - small overlay */}
//               {localStream && (
//                 <div className="absolute bottom-8 right-8 w-48 aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-lg">
//                   <video
//                     ref={localVideoRef}
//                     autoPlay
//                     playsInline
//                     muted
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}

//               {/* Call controls */}
//               <div className="flex justify-center space-x-4 mt-4">
//                 <button
//                   onClick={onEndCall}
//                   className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 8l4-4m0 0l-4-4m4 4H8m10 10L4 4"
//                     />
//                   </svg>
//                   End Call
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoCallModal;

import React, { useEffect, useRef } from "react";

const VideoCallModal = ({
  isOpen,
  isIncoming,
  callerName,
  localStream,
  remoteStream,
  connectionState,
  audioEnabled,
  videoEnabled,
  onAccept,
  onReject,
  onEndCall,
  onToggleAudio,
  onToggleVideo,
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Enhanced effect to handle video streams when they change
  useEffect(() => {
    // Handle local video stream
    if (localVideoRef.current && localStream) {
      console.log("Setting local video stream");
      localVideoRef.current.srcObject = localStream;
      
      // Ensure playback starts
      const playLocalVideo = async () => {
        try {
          await localVideoRef.current.play();
        } catch (err) {
          console.error("Error playing local video:", err);
        }
      };
      
      playLocalVideo();
    }
    
    // Handle remote video stream
    if (remoteVideoRef.current && remoteStream) {
      console.log("Setting remote video stream");
      remoteVideoRef.current.srcObject = remoteStream;
      
      // Ensure playback starts
      const playRemoteVideo = async () => {
        try {
          await remoteVideoRef.current.play();
        } catch (err) {
          console.error("Error playing remote video:", err);
        }
      };
      
      playRemoteVideo();
    }
    
    // Cleanup function to handle stream detachment
    return () => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
    };
  }, [localStream, remoteStream]);

  // Helper for connection state message
  const getConnectionStateMessage = () => {
    switch (connectionState) {
      case 'calling':
        return 'Calling...';
      case 'incoming':
        return `Incoming call from ${callerName || "Unknown"}`;
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'reconnecting':
        return 'Reconnecting...';
      case 'failed':
        return 'Connection failed';
      default:
        return 'Initializing...';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-4xl w-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">
            {isIncoming && !localStream 
              ? `Incoming call from ${callerName || "Unknown"}` 
              : "Video Call"}
          </h3>
          <div className="text-gray-300">
            {connectionState !== 'incoming' && (
              <span className="mr-4 text-sm bg-gray-700 py-1 px-3 rounded-full">
                {getConnectionStateMessage()}
              </span>
            )}
            <button
              onClick={onEndCall}
              className="text-gray-300 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Show incoming call UI or actual video call UI */}
          {isIncoming && !localStream ? (
            <div className="text-center">
              <div className="animate-pulse mb-4">
                <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-white text-lg mb-6">
                {callerName || "Someone"} is calling you...
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onAccept}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Accept
                </button>
                <button
                  onClick={onReject}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-full flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8l4-4m0 0l-4-4m4 4H8m10 10L4 4"
                    />
                  </svg>
                  Decline
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Main video area - display remote video */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                {remoteStream ? (
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-300">{getConnectionStateMessage()}</p>
                    </div>
                  </div>
                )}
                
                {/* Connection state overlay for debugging */}
                {connectionState !== 'connected' && remoteStream && (
                  <div className="absolute top-2 left-2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-xs text-white">
                    {getConnectionStateMessage()}
                  </div>
                )}
              </div>

              {/* Local video - small overlay */}
              {localStream && (
                <div className="absolute bottom-20 right-8 w-48 aspect-video bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video disabled overlay */}
                  {!videoEnabled && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Call controls */}
              <div className="flex justify-center space-x-4 mt-4">
                {/* Audio toggle button */}
                <button
                  onClick={onToggleAudio}
                  className={`${audioEnabled ? 'bg-gray-600' : 'bg-red-500'} hover:bg-opacity-80 text-white p-3 rounded-full`}
                  title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
                >
                  {audioEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  )}
                </button>
                
                {/* Video toggle button */}
                <button
                  onClick={onToggleVideo}
                  className={`${videoEnabled ? 'bg-gray-600' : 'bg-red-500'} hover:bg-opacity-80 text-white p-3 rounded-full`}
                  title={videoEnabled ? "Turn off camera" : "Turn on camera"}
                >
                  {videoEnabled ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
                
                {/* End call button */}
                <button
                  onClick={onEndCall}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
                  title="End call"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;