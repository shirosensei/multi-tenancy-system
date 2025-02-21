import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { requireRole } from '../middleware/rbacMiddleware';
import tenantResolver from '../middleware/tenantResolver';

const router = Router();

router.use(tenantResolver);

router.post('/', requireRole('admin'), createUser);
router.get('/', requireRole('viewer'), getUsers);

export default router;