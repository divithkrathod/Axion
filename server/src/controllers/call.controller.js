import Call from '../models/Call.js';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../middleware/errorHandler.js';

export const initiateCall = async (req, res, next) => {
  try {
    const { recipientId, callType = 'video' } = req.body;

    if (!recipientId) {
      return next(new AppError('Recipient ID is required', 400));
    }

    const roomId = uuidv4();

    const call = new Call({
      initiatorId: req.user._id,
      recipientId,
      callType,
      roomId,
      status: 'ringing',
    });

    await call.save();

    res.status(201).json({
      success: true,
      call,
      roomId,
    });
  } catch (error) {
    next(error);
  }
};

export const endCall = async (req, res, next) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId);

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    call.status = 'ended';
    call.endTime = new Date();
    if (call.startTime) {
      call.duration = Math.floor((call.endTime - call.startTime) / 1000);
    }

    await call.save();

    res.json({
      success: true,
      message: 'Call ended',
      call,
    });
  } catch (error) {
    next(error);
  }
};

export const getCallDetails = async (req, res, next) => {
  try {
    const { callId } = req.params;

    const call = await Call.findById(callId)
      .populate('initiatorId', 'username avatar email')
      .populate('recipientId', 'username avatar email');

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCallStatus = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { status, startTime } = req.body;

    const call = await Call.findById(callId);

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    if (['ringing', 'ongoing', 'ended', 'missed', 'declined'].includes(status)) {
      call.status = status;
    }

    if (status === 'ongoing' && !call.startTime) {
      call.startTime = new Date(startTime || Date.now());
    }

    await call.save();

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    next(error);
  }
};

export const getCallHistory = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const calls = await Call.find({
      $or: [
        { initiatorId: req.user._id },
        { recipientId: req.user._id },
      ],
    })
      .populate('initiatorId', 'username avatar')
      .populate('recipientId', 'username avatar')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    const total = await Call.countDocuments({
      $or: [
        { initiatorId: req.user._id },
        { recipientId: req.user._id },
      ],
    });

    res.json({
      success: true,
      calls,
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const addParticipant = async (req, res, next) => {
  try {
    const { callId } = req.params;
    const { userId } = req.body;

    const call = await Call.findById(callId);

    if (!call) {
      return next(new AppError('Call not found', 404));
    }

    const participantExists = call.participants.some(p => p.userId.toString() === userId);

    if (participantExists) {
      return next(new AppError('Participant already in call', 400));
    }

    call.participants.push({
      userId,
      joinedAt: new Date(),
    });

    await call.save();

    res.json({
      success: true,
      call,
    });
  } catch (error) {
    next(error);
  }
};
