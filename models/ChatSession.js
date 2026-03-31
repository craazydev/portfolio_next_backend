const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role:      { type: String, enum: ['user', 'assistant'], required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  sessionId:  { type: String, required: true, unique: true, index: true },
  // Visitor info (best-effort from browser)
  userAgent:  { type: String },
  ip:         { type: String },
  // First message becomes the "title" for easy identification in admin
  title:      { type: String, default: 'New Conversation' },
  messages:   [messageSchema],
  messageCount: { type: Number, default: 0 },
  lastMessage:  { type: Date, default: Date.now },
  // Admin can mark sessions
  read:       { type: Boolean, default: false },
  starred:    { type: Boolean, default: false },
}, { timestamps: true });

// Keep messageCount + lastMessage + title in sync
chatSessionSchema.pre('save', function (next) {
  if (this.isModified('messages')) {
    this.messageCount = this.messages.length;
    this.lastMessage  = new Date();
    // Title = first user message (truncated)
    const firstUser = this.messages.find(m => m.role === 'user');
    if (firstUser) {
      this.title = firstUser.content.substring(0, 60) + (firstUser.content.length > 60 ? '...' : '');
    }
  }
  next();
});

module.exports = mongoose.model('ChatSession', chatSessionSchema);
