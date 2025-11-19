const Post = require('../models/Post');
const Category = require('../models/Category');

// GET /api/posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) query.category = req.query.category;
    if (req.query.q) {
      const q = req.query.q.trim();
      // simple text search on title and content
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
      ];
    }

    const [posts, total] = await Promise.all([
      Post.find(query).populate('category author').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({ success: true, data: posts, meta: { total, page, limit } });
  } catch (err) {
    next(err);
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('category author');
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { title, content, category: categoryId, excerpt, tags, isPublished } = req.body;

    // Ensure category exists
    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (!cat) return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    // Use authenticated user if available
    const authorId = req.user ? req.user._id : req.body.author

    const post = new Post({ title, content, category: categoryId, author: authorId, excerpt, tags, isPublished });
    await post.save();
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { content } = req.body
    if (!content) return res.status(400).json({ success: false, message: 'Comment content required' })

    const post = await Post.findById(id)
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })

    const comment = { user: req.user ? req.user._id : null, content }
    post.comments.push(comment)
    await post.save()
    res.status(201).json({ success: true, data: comment })
  } catch (err) {
    next(err)
  }
}

// PUT /api/posts/:id
exports.updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.category) {
      const cat = await Category.findById(updates.category);
      if (!cat) return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const post = await Post.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    next(err);
  }
};
