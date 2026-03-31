const router      = require('express').Router();
const ChatSession = require('../models/ChatSession');
const auth        = require('../middleware/auth');

// GET /api/chats  — admin: all sessions list
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await ChatSession.find()
      .select('-messages')   // exclude messages for list view (save bandwidth)
      .sort({ lastMessage: -1 });
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chats/:sessionId  — admin: full conversation
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
    // Mark as read
    await ChatSession.findOneAndUpdate({ sessionId: req.params.sessionId }, { read: true });
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/chats/:sessionId/star  — admin: toggle star
router.patch('/:sessionId/star', auth, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ success: false, message: 'Not found' });
    session.starred = !session.starred;
    await session.save();
    res.json({ success: true, starred: session.starred });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/chats/:sessionId  — admin
router.delete('/:sessionId', auth, async (req, res) => {
  try {
    await ChatSession.findOneAndDelete({ sessionId: req.params.sessionId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/chats/stats/summary  — admin dashboard counts
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const [total, unread, starred] = await Promise.all([
      ChatSession.countDocuments(),
      ChatSession.countDocuments({ read: false }),
      ChatSession.countDocuments({ starred: true }),
    ]);
    res.json({ success: true, data: { total, unread, starred } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
