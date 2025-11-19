const Category = require('../models/Category');

// GET /api/categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) return res.status(409).json({ success: false, message: 'Category already exists' });

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
