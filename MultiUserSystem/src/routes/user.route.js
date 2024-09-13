import {Router} from 'express';
import adminChecker from '../middleware/admin.auth';
import { blockUser, unblockUser } from '../controllers/user.controller';

const router = Router();

router.route('/block/:id',adminChecker).put(blockUser)
router.route('/unblock/:id',adminChecker).post(unblockUser);

export default router;