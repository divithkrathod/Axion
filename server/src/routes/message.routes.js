import express from 'express';
import * as messageController from '../controllers/message.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', authenticate, messageController.sendMessage);
router.get('/', authenticate, messageController.getMessages);
router.put('/:messageId/read', authenticate, messageController.markAsRead);
router.delete('/:messageId', authenticate, messageController.deleteMessage);
router.get('/conversations', authenticate, messageController.getConversations);

export default router;
