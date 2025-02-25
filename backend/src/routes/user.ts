import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { requireRole } from '../middleware/rbacMiddleware';

const router = Router();

// POST /users (admin only)
router.post('/users', requireRole('admin'), createUser);

// GET /users (viewer only)
router.get('/users', requireRole('user'), getUsers);

export default router;