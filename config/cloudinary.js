const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Image storage (jpg/png/webp) ───────────────────────────────────────────
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = req.query.folder || 'portfolio';
    return {
      folder:         `portfolio/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      public_id: `${Date.now()}-${file.originalname.split('.')[0].replace(/\s+/g, '-')}`,
    };
  },
});

// ── PDF storage (resume) ───────────────────────────────────────────────────
const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder:          'portfolio/resumes',
    allowed_formats: ['pdf'],
    resource_type:   'raw',
    public_id:       `resume-ashutosh-${Date.now()}`,
  }),
});

const imageUpload = multer({
  storage: imageStorage,
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
});

const pdfUpload = multer({
  storage: pdfStorage,
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  },
});

module.exports = { cloudinary, imageUpload, pdfUpload };
