import {Router} from 'express';
import authentication from '../middleware/auth';
import { addUser, deleteStudent, editStudent } from '../controllers/student.controller';

const router = Router();

router.route('/add',authentication).post(addUser)
router.route('/edit/:id',authentication).put(editStudent)
router.route('/delete/:id',authentication).put(deleteStudent)

export default router;