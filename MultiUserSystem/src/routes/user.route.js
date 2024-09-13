import {Router} from 'express';
import adminChecker from '../middleware/admin.auth.js';
import { blockUser, unblockUser } from '../controllers/user.controller.js';

const router = Router();

router.route('/block/:id',adminChecker).put(blockUser)
router.route('/unblock/:id',adminChecker).post(unblockUser);

export default router;