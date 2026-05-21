const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  excerpt:     { type: String, required: true, maxlength: 300 },
  content:     { type: String, required: true },
  thumbnail:   { type: String },
  thumbnailId: { type: String },
  tags:        [String],
  category:    { type: String },
  readTime:    { type: Number, default: 5 },   // minutes
  published:   { type: Boolean, default: false },
  featured:    { type: Boolean, default: false },
  views:       { type: Number, default: 0 },
  // SEO
  metaTitle:   { type: String },
  metaDesc:    { type: String },
  metaKeywords:[String],
  ogImage:     { type: String },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Auto calculate read time (~200 words/min)
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
