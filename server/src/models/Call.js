import mongoose from 'mongoose';

const callSchema = new mongoose.Schema(
  {
    initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    callType: {
      type: String,
      enum: ['audio', 'video', 'group'],
      default: 'video',
    },
    status: {
      type: String,
      enum: ['ringing', 'ongoing', 'ended', 'missed', 'declined'],
      default: 'ringing',
    },
    roomId: {
      type: String,
      unique: true,
      required: true,
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // in seconds
    participants: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        joinedAt: Date,
        leftAt: Date,
      },
    ],
    recording: {
      isRecorded: { type: Boolean, default: false },
      recordingUrl: String,
      recordingSize: Number,
    },
    screenShare: {
      sharedBy: mongoose.Schema.Types.ObjectId,
      startedAt: Date,
      endedAt: Date,
    },
  },
  { timestamps: true }
);

callSchema.index({ initiatorId: 1, createdAt: -1 });
callSchema.index({ recipientId: 1, createdAt: -1 });
callSchema.index({ roomId: 1 });

export default mongoose.model('Call', callSchema);
