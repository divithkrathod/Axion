import User from '../models/User.js';
import Call from '../models/Call.js';
import Message from '../models/Message.js';
import { authenticateSocket } from '../middleware/auth.js';
import { encrypt } from '../utils/encryption.js';

const userSockets = new Map(); // Map of userId -> socketId

export const setupSocketHandlers = (socket, io) => {
  // User connects
  socket.on('user:connect', async (userId) => {
    userSockets.set(userId, socket.id);

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { isOnline: true, status: 'available' },
        { new: true }
      );

      io.emit('user:online', {
        userId,
        status: 'available',
      });

      console.log(`✅ User ${userId} connected (${socket.id})`);
    } catch (error) {
      console.error('Error connecting user:', error);
    }
  });

  // User disconnects
  socket.on('disconnect', async () => {
    let userId;
    for (const [id, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userId = id;
        break;
      }
    }

    if (userId) {
      userSockets.delete(userId);

      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          status: 'offline',
          lastSeen: new Date(),
        });

        io.emit('user:offline', { userId });
        console.log(`❌ User ${userId} disconnected`);
      } catch (error) {
        console.error('Error disconnecting user:', error);
      }
    }
  });

  // Update user status
  socket.on('user:status', async (userId, status) => {
    try {
      await User.findByIdAndUpdate(userId, { status });
      io.emit('user:status-changed', { userId, status });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  });

  // WebRTC Signaling
  socket.on('call:offer', (data) => {
    const { callId, initiatorId, recipientId, offer } = data;
    const recipientSocketId = userSockets.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('call:offer', {
        callId,
        initiatorId,
        offer,
      });
    } else {
      socket.emit('call:error', { message: 'Recipient not available' });
    }
  });

  socket.on('call:answer', (data) => {
    const { callId, initiatorId, answer } = data;
    const initiatorSocketId = userSockets.get(initiatorId);

    if (initiatorSocketId) {
      io.to(initiatorSocketId).emit('call:answer', {
        callId,
        answer,
      });
    }
  });

  socket.on('call:ice-candidate', (data) => {
    const { targetUserId, candidate } = data;
    const targetSocketId = userSockets.get(targetUserId);

    if (targetSocketId) {
      io.to(targetSocketId).emit('call:ice-candidate', { candidate });
    }
  });

  socket.on('call:reject', (data) => {
    const { callId, targetUserId } = data;
    const targetSocketId = userSockets.get(targetUserId);

    if (targetSocketId) {
      io.to(targetSocketId).emit('call:rejected', { callId });
    }
  });

  // Room operations
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user:joined', { userId: socket.userId });
    console.log(`👤 User joined room: ${roomId}`);
  });

  socket.on('room:leave', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user:left');
    console.log(`👤 User left room: ${roomId}`);
  });

  // Screen sharing
  socket.on('screen:share-start', (roomId) => {
    socket.to(roomId).emit('screen:share-started');
  });

  socket.on('screen:share-end', (roomId) => {
    socket.to(roomId).emit('screen:share-ended');
  });

  // Whiteboard
  socket.on('whiteboard:draw', (data) => {
    const { roomId, drawData } = data;
    socket.to(roomId).emit('whiteboard:draw', drawData);
  });

  socket.on('whiteboard:clear', (roomId) => {
    socket.to(roomId).emit('whiteboard:clear');
  });

  // Messaging
  socket.on('message:send', async (data) => {
    const { senderId, recipientId, content, roomId } = data;

    try {
      const message = new Message({
        senderId,
        recipientId,
        roomId,
        content: encrypt(content),
        isEncrypted: true,
      });

      await message.save();

      const recipientSocketId = userSockets.get(recipientId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('message:receive', {
          messageId: message._id,
          senderId,
          content,
          timestamp: message.createdAt,
        });
      }

      socket.emit('message:sent', { messageId: message._id });
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('message:error', { message: 'Failed to send message' });
    }
  });

  // Typing indicator
  socket.on('typing:start', (data) => {
    const { recipientId, senderName } = data;
    const recipientSocketId = userSockets.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:indicator', { senderName });
    }
  });

  socket.on('typing:end', (recipientId) => {
    const recipientSocketId = userSockets.get(recipientId);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing:stopped');
    }
  });

  // Computer Vision - Emotion/Face Detection
  socket.on('cv:emotion', (data) => {
    const { roomId, emotion, userId } = data;
    socket.to(roomId).emit('cv:emotion-detected', { userId, emotion });
  });

  socket.on('cv:gesture', (data) => {
    const { roomId, gesture, userId } = data;
    socket.to(roomId).emit('cv:gesture-detected', { userId, gesture });
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};
