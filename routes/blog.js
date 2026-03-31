const router = require('express').Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// GET /api/blog?tag=react&page=1&limit=6
router.get('/', async (req, res) => {
  try {
    const { tag, category, page = 1, limit = 6 } = req.query;
    const filter = { published: true };
    if (tag)      filter.tags     = tag;
    if (category) filter.category = category;

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(filter);
    const posts = await Blog.find(filter)
      .select('-content')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/blog/:slug  — increments views
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate(
      { slug: req.params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/blog  — admin
router.post('/', auth, async (req, res) => {
  try {
    const post = await Blog.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/blog/:id  — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/blog/:id  — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
