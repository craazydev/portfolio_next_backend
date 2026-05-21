const mongoose = require('mongoose');
const slugify = require('slugify');

const projectSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String, required: true },
  longDesc:    { type: String },
  thumbnail:   { type: String },
  thumbnailId: { type: String },
  images:      [String],
  tech:        [String],
  category:    { type: String, enum: ['fullstack', 'frontend', 'backend', 'mobile', 'tool'], default: 'fullstack' },
  liveUrl:     { type: String },
  githubUrl:   { type: String },
  featured:    { type: Boolean, default: false },
  order:       { type: Number, default: 0 },
  published:   { type: Boolean, default: true },
  // SEO
  metaTitle:    { type: String },
  metaDesc:     { type: String },
  metaKeywords: [String],
  ogImage:      { type: String },
}, { timestamps: true });

// Auto-generate slug
projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
