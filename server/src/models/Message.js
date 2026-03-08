import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    roomId: String,
    content: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'system'],
      default: 'text',
    },
    fileData: {
      fileName: String,
      fileSize: Number,
      fileType: String,
      fileUrl: String,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    deletedBy: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ roomId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, recipientId: 1 });

export default mongoose.model('Message', messageSchema);
