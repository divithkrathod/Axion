export class WebRTCManager {
  constructor() {
    this.peerConnections = new Map();
    this.localStream = null;
    this.dataChannels = new Map();
  }

  async getLocalStream(audio = true, video = true) {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        } : false,
      });
      return this.localStream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      throw error;
    }
  }

  async createPeerConnection(peerId, onRemoteStream) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
      ],
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      if (onRemoteStream) {
        onRemoteStream(event.stream);
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate?.(peerId, event.candidate);
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state with ${peerId}: ${peerConnection.connectionState}`);
    };

    this.peerConnections.set(peerId, peerConnection);
    return peerConnection;
  }

  async createOffer(peerId) {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return null;

    const offer = await peerConnection.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  async handleOffer(peerId, offer, onRemoteStream) {
    let peerConnection = this.peerConnections.get(peerId);

    if (!peerConnection) {
      peerConnection = await this.createPeerConnection(peerId, onRemoteStream);
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    return answer;
  }

  async handleAnswer(peerId, answer) {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  async addIceCandidate(peerId, candidate) {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return;

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  closePeerConnection(peerId) {
    const peerConnection = this.peerConnections.get(peerId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(peerId);
    }

    const dataChannel = this.dataChannels.get(peerId);
    if (dataChannel) {
      dataChannel.close();
      this.dataChannels.delete(peerId);
    }
  }

  closeAllConnections() {
    this.peerConnections.forEach((pc, peerId) => {
      pc.close();
    });
    this.peerConnections.clear();

    this.dataChannels.forEach((dc) => {
      dc.close();
    });
    this.dataChannels.clear();
  }

  stopLocalStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
  }

  toggleAudio(enabled) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  toggleVideo(enabled) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enabled;
      });
    }
  }

  async getScreenShare() {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
        },
        audio: false,
      });
      return screenStream;
    } catch (error) {
      console.error('Error getting screen share:', error);
      throw error;
    }
  }

  createDataChannel(peerId, label = 'data') {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return null;

    const dataChannel = peerConnection.createDataChannel(label, {
      ordered: true,
    });
    this.setupDataChannel(dataChannel);
    this.dataChannels.set(peerId, dataChannel);

    return dataChannel;
  }

  setupDataChannel(dataChannel) {
    dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    dataChannel.onclose = () => {
      console.log('Data channel closed');
    };

    dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };

    dataChannel.onmessage = (event) => {
      console.log('Data received:', event.data);
    };
  }

  sendData(peerId, data) {
    const dataChannel = this.dataChannels.get(peerId);
    if (dataChannel && dataChannel.readyState === 'open') {
      dataChannel.send(JSON.stringify(data));
    }
  }

  getStats(peerId) {
    const peerConnection = this.peerConnections.get(peerId);
    if (!peerConnection) return null;

    return peerConnection.getStats();
  }
}

export default new WebRTCManager();
