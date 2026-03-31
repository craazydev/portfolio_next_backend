const router = require('express').Router();
const auth   = require('../middleware/auth');
const { cloudinary, imageUpload, pdfUpload } = require('../config/cloudinary');

// ── POST /api/upload/image?folder=projects|blog|profile ───────────────────
// Field name: "file"
router.post('/image', auth, imageUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success:   true,
    url:       req.file.path,          // Cloudinary secure URL
    publicId:  req.file.filename,      // for deletion later
  });
});

// ── POST /api/upload/pdf ───────────────────────────────────────────────────
// Field name: "file"
router.post('/pdf', auth, pdfUpload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({
    success:  true,
    url:      req.file.path,
    publicId: req.file.filename,
  });
});

// ── DELETE /api/upload ─────────────────────────────────────────────────────
// Body: { publicId, resourceType? }
router.delete('/', auth, async (req, res) => {
  const { publicId, resourceType = 'image' } = req.body;
  if (!publicId) return res.status(400).json({ success: false, message: 'publicId required' });
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Error handler for multer
router.use((err, req, res, next) => {
  res.status(400).json({ success: false, message: err.message });
});

module.exports = router;
