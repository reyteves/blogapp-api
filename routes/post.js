const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const auth = require('../auth');

// Public Routes
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getSinglePost);

// Protected Routes
router.post('/', auth.verify, postController.createPost);
router.patch('/:id', auth.verify, postController.updatePost);
router.delete('/:id', auth.verify, postController.deletePost);

module.exports = router;
