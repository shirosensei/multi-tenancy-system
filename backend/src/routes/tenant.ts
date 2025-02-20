import { Router } from 'express';
import { createTenant } from '../controllers/tenantController';

const router = Router();

// POST /tenants
router.post('/', createTenant);

export default router;