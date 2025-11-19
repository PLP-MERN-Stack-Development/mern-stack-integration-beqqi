const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { requireAuth } = require('../middleware/clerkAuth');

// Validation helpers
const validatePost = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('content').isString().trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isMongoId().withMessage('Category must be a valid id'),
];

// List posts
router.get('/', postsController.getAllPosts);

// Get single post
router.get('/:id', [param('id').isMongoId().withMessage('Invalid post id')], postsController.getPost);

// Create post
router.post('/', validatePost, requireAuth, postsController.createPost);

// Update post
router.put('/:id', [param('id').isMongoId().withMessage('Invalid post id'), ...validatePost], postsController.updatePost);

// Delete post
router.delete('/:id', [param('id').isMongoId().withMessage('Invalid post id')], requireAuth, postsController.deletePost);

// Add comment to post (authenticated)
router.post('/:id/comments', [param('id').isMongoId().withMessage('Invalid post id'), body('content').isString().notEmpty().withMessage('Content required')], requireAuth, postsController.addComment);

module.exports = router;
