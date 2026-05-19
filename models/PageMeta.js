const mongoose = require('mongoose');

const pageMetaSchema = new mongoose.Schema({
  page:        { type: String, required: true, unique: true }, // home|about|contact|projects|blog
  title:       { type: String },
  description: { type: String },
  keywords:    [String],
  ogImage:     { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PageMeta', pageMetaSchema);
