const router    = require('express').Router();
const Knowledge = require('../models/KnowledgeBase');
const auth      = require('../middleware/auth');

// GET /api/knowledge  — public (used to build system prompt)
router.get('/', async (req, res) => {
  try {
    const entries = await Knowledge.find({ active: true }).sort({ order: 1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/knowledge/all  — admin (includes inactive)
router.get('/all', auth, async (req, res) => {
  try {
    const entries = await Knowledge.find().sort({ category: 1, order: 1 });
    res.json({ success: true, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/knowledge  — admin
router.post('/', auth, async (req, res) => {
  try {
    const entry = await Knowledge.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/knowledge/:id  — admin
router.put('/:id', auth, async (req, res) => {
  try {
    const entry = await Knowledge.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/knowledge/:id  — admin
router.delete('/:id', auth, async (req, res) => {
  try {
    await Knowledge.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
