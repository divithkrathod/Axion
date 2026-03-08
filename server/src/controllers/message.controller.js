import Message from '../models/Message.js';
import { encrypt, decrypt } from '../utils/encryption.js';
import { AppError } from '../middleware/errorHandler.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content, messageType = 'text', fileData } = req.body;

    if (!content && messageType === 'text') {
      return next(new AppError('Message content is required', 400));
    }

    const message = new Message({
      senderId: req.user._id,
      recipientId,
      content: encrypt(content),
      messageType,
      fileData,
      isEncrypted: true,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: {
        ...message.toObject(),
        content: content,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { recipientId, limit = 50, skip = 0 } = req.query;

    if (!recipientId) {
      return next(new AppError('Recipient ID is required', 400));
    }

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, recipientId },
        { senderId: recipientId, recipientId: req.user._id },
      ],
      deletedBy: { $ne: req.user._id },
    })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort({ createdAt: -1 });

    // Decrypt messages
    const decryptedMessages = messages.map(msg => {
      const msgObj = msg.toObject();
      if (msgObj.isEncrypted) {
        msgObj.content = decrypt(msgObj.content);
      }
      return msgObj;
    });

    res.json({
      success: true,
      messages: decryptedMessages.reverse(),
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return next(new AppError('Message not found', 404));
    }

    message.deletedBy.push(req.user._id);
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted',
    });
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { recipientId: req.user._id },
          ],
          deletedBy: { $not: { $elemMatch: { $eq: req.user._id } } },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user._id] },
              '$recipientId',
              '$senderId',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $limit: parseInt(limit),
      },
      {
        $skip: parseInt(skip),
      },
    ]);

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};
