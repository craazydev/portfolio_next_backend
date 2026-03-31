const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  content:  { type: String, required: true },
  category: {
    type: String,
    enum: ['about', 'skills', 'projects', 'services', 'pricing', 'contact', 'faq', 'general'],
    default: 'general',
  },
  active:   { type: Boolean, default: true },
  order:    { type: Number,  default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBase', knowledgeSchema);
