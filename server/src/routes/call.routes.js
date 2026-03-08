import express from 'express';
import * as callController from '../controllers/call.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/initiate', authenticate, callController.initiateCall);
router.put('/:callId/end', authenticate, callController.endCall);
router.get('/:callId', authenticate, callController.getCallDetails);
router.put('/:callId/status', authenticate, callController.updateCallStatus);
router.get('/', authenticate, callController.getCallHistory);
router.post('/:callId/participants', authenticate, callController.addParticipant);

export default router;
