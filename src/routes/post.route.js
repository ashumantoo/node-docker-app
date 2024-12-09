import express from 'express';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/post.controller.js';
import { reqiresAuthentication } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/post', reqiresAuthentication, createPost);
router.get('/post', reqiresAuthentication, getPosts);
router.get('/post/:id', reqiresAuthentication, getPost);
router.put('/post/:id', reqiresAuthentication, updatePost);
router.delete('/post/:id', reqiresAuthentication, deletePost);

export default router;