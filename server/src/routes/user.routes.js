import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile/:userId', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/call-history', authenticate, userController.getCallHistory);
router.get('/search', authenticate, userController.searchUsers);
router.get('/online', authenticate, userController.getOnlineUsers);
router.put('/settings', authenticate, userController.updateSettings);

export default router;
