import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { userService, callService } from '../services/api';
import socketService from '../services/socket';
import webrtcManager from '../lib/webrtc';

function VideoSection() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    setupSocketListeners();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, historyRes] = await Promise.all([
        userService.getOnlineUsers(),
        callService.getCallHistory(),
      ]);

      setOnlineUsers(usersRes.users || []);
      setCallHistory(historyRes.calls || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('user:online', (data) => {
      setOnlineUsers(prev => {
        if (!prev.find(u => u._id === data.userId)) {
          return [...prev, { _id: data.userId }];
        }
        return prev;
      });
    });

    socketService.on('user:offline', (data) => {
      setOnlineUsers(prev => prev.filter(u => u._id !== data.userId));
    });
  };

  const initiateCall = async (recipientId, callType = 'video') => {
    try {
      const response = await callService.initiateCall(recipientId, callType);

      // Initialize WebRTC
      const localStream = await webrtcManager.getLocalStream(true, true);
      const peerConnection = await webrtcManager.createPeerConnection(recipientId, (stream) => {
        // Handle remote stream
      });

      const offer = await webrtcManager.createOffer(recipientId);

      // Emit call offer via socket
      socketService.emit('call:offer', {
        callId: response.call._id,
        initiatorId: user._id,
        recipientId,
        offer,
      });

      // Navigate to call page
      navigate(`/call/${response.roomId}`);
    } catch (error) {
      console.error('Error initiating call:', error);
      alert('Failed to initiate call');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online Users */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">🟢 Online Users</h2>
          <div className="space-y-2">
            {onlineUsers.length > 0 ? (
              onlineUsers.map(onlineUser => (
                <div
                  key={onlineUser._id}
                  className="flex items-center justify-between p-3 border border-slate-700 rounded-lg hover:border-cyan-600 hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {onlineUser.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-100">{onlineUser.fullName}</p>
                      <p className="text-sm text-slate-400">@{onlineUser.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => initiateCall(onlineUser._id, 'video')}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-sm font-semibold shadow-lg glow-effect"
                  >
                    Call
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No online users</p>
            )}
          </div>
        </div>

        {/* Call History */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">📞 Recent Calls</h2>
          <div className="space-y-2">
            {callHistory.length > 0 ? (
              callHistory.slice(0, 5).map(call => (
                <div
                  key={call._id}
                  className="flex items-center justify-between p-3 border border-slate-700 rounded-lg hover:border-cyan-600 hover:bg-slate-700 transition-colors"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {call.initiatorId._id === user._id
                        ? `Called ${call.recipientId.username}`
                        : `Called by ${call.initiatorId.username}`}
                    </p>
                    <p className="text-sm text-slate-400">
                      {call.duration ? `${call.duration} seconds` : 'Missed call'}
                    </p>
                  </div>
                  <button
                    onClick={() => initiateCall(
                      call.initiatorId._id === user._id
                        ? call.recipientId._id
                        : call.initiatorId._id,
                      'video'
                    )}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all text-sm font-semibold shadow-lg glow-effect"
                  >
                    Recall
                  </button>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No call history</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoSection;
