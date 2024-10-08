import {Router} from 'express';
import { login, registerUser } from '../controllers/auth.controller.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(login)

export default router;