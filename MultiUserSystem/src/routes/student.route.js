import {Router} from 'express';
import authentication from '../middleware/auth.js';
import { addUser, deleteStudent, editStudent } from '../controllers/student.controller.js';

const router = Router();

router.route('/add',authentication).post(addUser)
router.route('/edit/:id',authentication).put(editStudent)
router.route('/delete/:id',authentication).put(deleteStudent)

export default router;