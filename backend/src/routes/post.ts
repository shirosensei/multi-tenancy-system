import { Router } from 'express';
import { createPost, getPosts } from '../controllers/postController';

const router = Router();


// POST /posts
router.post('/', createPost);

// GET /posts
router.get('/', getPosts);

export default router;