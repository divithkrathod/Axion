import User from '../models/User.js';
import Call from '../models/Call.js';
import { AppError } from '../middleware/errorHandler.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, avatar, bio, status } = req.body;

    const user = req.user;

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;
    if (status && ['available', 'busy', 'offline'].includes(status)) {
      user.status = status;
    }

    await user.save();

    res.json({
      success: true,
      user: user.getPublicProfile(),
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
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { query, limit = 20 } = req.query;

    if (!query || query.length < 2) {
      return res.json({ success: true, users: [] });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { fullName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
          ],
        },
        { _id: { $ne: req.user._id } },
      ],
    })
      .limit(parseInt(limit))
      .select('_id username fullName avatar status isOnline');

    res.json({
      success: true,
      users: users.map(u => u.getPublicProfile()),
    });
  } catch (error) {
    next(error);
  }
};

export const getOnlineUsers = async (req, res, next) => {
  try {
    const users = await User.find({
      $and: [
        { isOnline: true },
        { _id: { $ne: req.user._id } },
      ],
    }).select('_id username fullName avatar status isOnline');

    res.json({
      success: true,
      users: users.map(u => u.getPublicProfile()),
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { notificationsEnabled, privacyLevel } = req.body;

    const user = req.user;

    if (typeof notificationsEnabled === 'boolean') {
      user.settings.notificationsEnabled = notificationsEnabled;
    }

    if (privacyLevel && ['public', 'friends', 'private'].includes(privacyLevel)) {
      user.settings.privacyLevel = privacyLevel;
    }

    await user.save();

    res.json({
      success: true,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    next(error);
  }
};
