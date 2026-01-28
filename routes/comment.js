const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');
const auth = require('../auth');

// Public Routes
router.get('/post/:postId', commentController.getCommentsForPost);

// Protected Routes
router.post('/', auth.verify, commentController.addComment);

// Admin Only Routes
router.delete('/:id', auth.verify, auth.verifyAdmin, commentController.removeComment);

module.exports = router;
