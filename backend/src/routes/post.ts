import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { tenantResolver } from '../middleware/tenantResolver';
import { TenantRequest } from '../middleware/tenantResolver';

const router = Router();

// Apply tenantResolver middleware to all post routes
router.use(tenantResolver);

// POST /posts
router.post('/', createPost);

// GET /posts
router.get('/', getPosts);

export default router;