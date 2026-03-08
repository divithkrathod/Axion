import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore, useMediaStore } from '../store';
import socketService from '../services/socket';
import webrtcManager from '../lib/webrtc';
import { initDetectors, detectFaces, drawFaceBoxes } from '../lib/computerVision';

function CallPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { localStream, setLocalStream, setRemoteStream, isAudioEnabled, isVideoEnabled } = useMediaStore();
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false);

  useEffect(() => {
    const initCall = async () => {
      try {
        // Get local stream
        const stream = await webrtcManager.getLocalStream(true, true);
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize computer vision
        await initDetectors();

        // Setup socket listeners
        socketService.on('call:answer', handleAnswer);
        socketService.on('call:ice-candidate', handleIceCandidate);
        socketService.on('user:left', handleUserLeft);

        // Start face detection if enabled
        if (faceDetectionEnabled && canvasRef.current) {
          startFaceDetection();
        }
      } catch (error) {
        console.error('Error initializing call:', error);
        alert('Failed to initialize call. Please check your camera and microphone permissions.');
      }
    };

    initCall();

    // Timer for call duration
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      socketService.off('call:answer', handleAnswer);
      socketService.off('call:ice-candidate', handleIceCandidate);
      socketService.off('user:left', handleUserLeft);
    };
  }, [faceDetectionEnabled]);

  const handleAnswer = async (data) => {
    await webrtcManager.handleAnswer(data.targetUserId, data.answer);
  };

  const handleIceCandidate = async (data) => {
    await webrtcManager.addIceCandidate(data.targetUserId, data.candidate);
  };

  const handleUserLeft = () => {
    cleanupCall();
  };

  const startFaceDetection = async () => {
    if (!localVideoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = localVideoRef.current;

    const detectFrame = async () => {
      if (!faceDetectionEnabled) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Detect faces
        const faces = await detectFaces(video);
        drawFaceBoxes(canvas, ctx, faces);

        // Emit emotion data
        if (faces.length > 0) {
          socketService.emit('cv:emotion', {
            roomId,
            emotion: 'happy',
            userId: user._id,
          });
        }
      }

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        const videoTracks = localStream.getVideoTracks();
        videoTracks.forEach(track => track.stop());
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await webrtcManager.getScreenShare();
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in peer connections
        webrtcManager.peerConnections.forEach(async (pc) => {
          const sender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
          if (sender) {
            await sender.replaceTrack(screenTrack);
          }
        });

        setIsScreenSharing(true);
        socketService.emit('screen:share-start', roomId);

        // Listen for screen share end
        screenTrack.onended = () => {
          setIsScreenSharing(false);
          socketService.emit('screen:share-end', roomId);
        };
      }
    } catch (error) {
      console.error('Screen sharing error:', error);
    }
  };

  const toggleAudio = () => {
    webrtcManager.toggleAudio(!isAudioEnabled);
  };

  const toggleVideo = () => {
    webrtcManager.toggleVideo(!isVideoEnabled);
  };

  const endCall = () => {
    cleanupCall();
    navigate('/');
  };

  const cleanupCall = () => {
    webrtcManager.closeAllConnections();
    webrtcManager.stopLocalStream();
    setRemoteStream(null);
    setLocalStream(null);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-screen h-screen bg-slate-900 flex flex-col">
      {/* Videos */}
      <div className="flex-1 flex gap-4 p-4">
        {/* Remote Video */}
        <div className="flex-1 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-700 shadow-lg">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Local Video */}
        <div className="w-64 bg-slate-800 rounded-lg overflow-hidden relative border-2 border-cyan-600 shadow-lg glow-effect">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Face Detection Canvas */}
          {faceDetectionEnabled && (
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          )}
        </div>
      </div>

      {/* Call Duration */}
      <div className="text-center py-4 text-slate-100 text-2xl font-semibold bg-gradient-to-r from-slate-800 to-slate-700">
        Call Duration: {formatTime(callDuration)}
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-center gap-4 border-t border-slate-700">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full transition-all shadow-lg text-xl ${
            isAudioEnabled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-effect'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
        >
          🎤
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full transition-all shadow-lg text-xl ${
            isVideoEnabled
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 glow-effect'
              : 'bg-red-600 hover:bg-red-700'
          }`}
          title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
        >
          📹
        </button>

        <button
          onClick={toggleScreenShare}
          className={`p-4 rounded-full transition-all shadow-lg text-xl ${
            isScreenSharing
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 glow-effect'
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
          title="Share Screen"
        >
          🖥️
        </button>

        <button
          onClick={() => setFaceDetectionEnabled(!faceDetectionEnabled)}
          className={`p-4 rounded-full transition-all shadow-lg text-xl ${
            faceDetectionEnabled
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 glow-effect'
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
          title="Toggle Face Detection"
        >
          👁️
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all shadow-lg text-xl glow-effect"
          title="End Call"
        >
          ☎️
        </button>
      </div>
    </div>
  );
}

export default CallPage;
