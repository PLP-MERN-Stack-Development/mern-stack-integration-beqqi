const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

const validateCategory = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
];

router.get('/', categoriesController.getAllCategories);
router.post('/', validateCategory, categoriesController.createCategory);

module.exports = router;
