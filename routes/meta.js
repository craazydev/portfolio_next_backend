const router = require('express').Router();
const auth   = require('../middleware/auth');
const PageMeta = require('../models/PageMeta');

const PAGES = ['home', 'about', 'contact', 'projects', 'blog'];

// GET /api/meta — all pages (public)
router.get('/', async (req, res) => {
  try {
    const all = await PageMeta.find({});
    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/meta/:page — single page (public)
router.get('/:page', async (req, res) => {
  try {
    const doc = await PageMeta.findOne({ page: req.params.page });
    res.json({ success: true, data: doc || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/meta/:page — upsert (auth)
router.put('/:page', auth, async (req, res) => {
  if (!PAGES.includes(req.params.page)) {
    return res.status(400).json({ success: false, message: 'Invalid page' });
  }
  try {
    const { title, description, keywords, ogImage } = req.body;
    const doc = await PageMeta.findOneAndUpdate(
      { page: req.params.page },
      { title, description, keywords: Array.isArray(keywords) ? keywords : [], ogImage },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
