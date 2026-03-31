const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name:        { type: String, required: true, default: 'Ashutosh Dubey' },
  title:       { type: String, default: 'Full Stack Developer' },
  tagline:     { type: String, default: 'Building Scalable Web Applications' },
  bio:         { type: String },
  location:    { type: String, default: 'Lucknow, India' },
  email:       { type: String },
  phone:       { type: String },
  yearsExp:    { type: Number, default: 3 },
  projectsDone:{ type: Number, default: 25 },
  profilePic:    { type: String },
  profilePicId:  { type: String },
  resumeUrl:     { type: String },
  resumeId:      { type: String },
  social: {
    github:    { type: String, default: 'https://github.com/Ashutosh724425' },
    linkedin:  { type: String, default: 'https://linkedin.com/in/ashutosh-dubey-78111225b/' },
    twitter:   { type: String },
    instagram: { type: String },
  },
  skills: [{
    category: String,
    items: [{ name: String, level: Number }],
  }],
  services: [{
    icon:        String,
    title:       String,
    description: String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
