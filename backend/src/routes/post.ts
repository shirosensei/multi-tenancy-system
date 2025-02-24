import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postController';
import { identifyTenant } from '../middleware/identifyTenant'
import { ApiResponse, PostResponse } from 'src/types/express';

const router = Router();

// Apply tenant identification middleware to all post routes
router.use(identifyTenant);

// POST /posts
router.post('/post', createPost);

// GET /posts
router.get('/post', getPosts);

export default router;