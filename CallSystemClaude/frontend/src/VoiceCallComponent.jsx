import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';

const VoiceCallComponent = ({ 
  currentUser, 
  targetUser, 
  socket = null 
}) => {
  const [callStatus, setCallStatus] = useState('idle');
  const [isMuted, setIsMuted] = useState(false);
  
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // Utility function to emit socket events safely
  const safeSocketEmit = useCallback((event, data) => {
    if (socket && socket.emit) {
      socket.emit(event, data);
    }
  }, [socket]);

  // Utility function to safely add socket listeners
  const safeSocketOn = useCallback((event, handler) => {
    if (socket && socket.on) {
      socket.on(event, handler);
      return () => {
        if (socket.off) {
          socket.off(event, handler);
        }
      };
    }
    return () => {};
  }, [socket]);

  useEffect(() => {
    // Exit if socket is not provided
    if (!socket) {
      console.warn('Socket not provided to VoiceCallComponent');
      return () => {};
    }

    // WebRTC configuration
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    };

    // Handlers for WebRTC signaling
    const handleOffer = async (offerData) => {
      if (!offerData || !offerData.offer) return;

      try {
        // Create or reset peer connection
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }
        peerConnectionRef.current = new RTCPeerConnection(configuration);

        // Setup local stream if exists
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
          });
        }

        // Handle incoming tracks
        peerConnectionRef.current.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
            setCallStatus('connected');
          }
        };

        // Handle ICE candidates
        peerConnectionRef.current.onicecandidate = (event) => {
          if (event.candidate) {
            safeSocketEmit('webrtc-candidate', {
              candidate: event.candidate,
              targetUserId: targetUser?.id
            });
          }
        };

        // Set remote description
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(offerData.offer)
        );
        
        // Create answer
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        
        // Send answer back
        safeSocketEmit('webrtc-answer', {
          answer: answer,
          targetUserId: targetUser?.id
        });
      } catch (error) {
        console.error('Error handling offer:', error);
        setCallStatus('error');
      }
    };

    const handleAnswer = async (answerData) => {
      try {
        if (peerConnectionRef.current && answerData?.answer) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answerData.answer)
          );
          setCallStatus('connected');
        }
      } catch (error) {
        console.error('Error handling answer:', error);
      }
    };

    const handleIceCandidate = async (candidateData) => {
      try {
        if (peerConnectionRef.current && candidateData?.candidate) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidateData.candidate)
          );
        }
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    };

    // Add socket listeners
    const offOffer = safeSocketOn('webrtc-offer', handleOffer);
    const offAnswer = safeSocketOn('webrtc-answer', handleAnswer);
    const offCandidate = safeSocketOn('webrtc-candidate', handleIceCandidate);

    // Cleanup function
    return () => {
      offOffer();
      offAnswer();
      offCandidate();

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [socket, targetUser, safeSocketEmit, safeSocketOn]);

  const startCall = async () => {
    // Validate prerequisites
    if (!socket || !targetUser?.id) {
      console.error('Cannot start call: Missing socket or target user');
      return;
    }

    try {
      // Request audio access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set local audio stream
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      localStreamRef.current = stream;

      // Create peer connection
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      peerConnectionRef.current = new RTCPeerConnection(configuration);

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnectionRef.current.addTrack(track, stream);
      });

      // Handle remote tracks
      peerConnectionRef.current.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          setCallStatus('connected');
        }
      };

      // Handle ICE candidates
      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          safeSocketEmit('webrtc-candidate', {
            candidate: event.candidate,
            targetUserId: targetUser.id
          });
        }
      };

      // Create offer
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      // Send offer to target user
      safeSocketEmit('webrtc-offer', {
        offer: offer,
        targetUserId: targetUser.id
      });

      setCallStatus('calling');
    } catch (error) {
      console.error('Error starting call:', error);
      setCallStatus('error');
    }
  };

  const endCall = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset UI
    setCallStatus('idle');
    
    // Notify other user
    safeSocketEmit('call-ended', { targetUserId: targetUser?.id });
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Render logic with additional error handling
  if (!currentUser || !targetUser) {
    return <div>User information required</div>;
  }

  return (
    <div className="voice-call-container">
      <audio ref={localAudioRef} muted />
      <audio ref={remoteAudioRef} autoPlay />
      
      <div className="call-controls">
        {callStatus === 'idle' && (
          <button 
            onClick={startCall} 
            className="start-call"
            disabled={!socket}
          >
            <Phone color="green" />
            Start Call
          </button>
        )}
        
        {callStatus === 'calling' && (
          <div>Calling...</div>
        )}
        
        {callStatus === 'connected' && (
          <>
            <button 
              onClick={toggleMute} 
              className="mute-toggle"
            >
              {isMuted ? <MicOff color="red" /> : <Mic />}
            </button>
            <button 
              onClick={endCall} 
              className="end-call"
            >
              <PhoneOff color="red" />
              End Call
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceCallComponent;