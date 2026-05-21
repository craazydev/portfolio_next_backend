require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const https = require('https');

const app = express();

const DEFAULT_KEEP_ALIVE_INTERVAL_MINUTES = 10;

function requestUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    const req = client.get(url, (res) => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });

    req.setTimeout(10000, () => {
      req.destroy(new Error('Keep-alive request timed out'));
    });
    req.on('error', reject);
  });
}

function startKeepAlive() {
  const keepAliveUrl = (process.env.KEEP_ALIVE_URL || '').trim();
  if (!keepAliveUrl) return;

  const configuredInterval = Number(process.env.KEEP_ALIVE_INTERVAL_MINUTES);
  const intervalMinutes = Number.isFinite(configuredInterval) && configuredInterval > 0
    ? configuredInterval
    : DEFAULT_KEEP_ALIVE_INTERVAL_MINUTES;
  const intervalMs = intervalMinutes * 60 * 1000;

  const ping = async () => {
    try {
      const statusCode = await requestUrl(keepAliveUrl);
      console.log(`[keep-alive] Pinged ${keepAliveUrl} (${statusCode})`);
    } catch (err) {
      console.warn(`[keep-alive] Ping failed: ${err.message}`);
    }
  };

  console.log(`[keep-alive] Enabled for ${keepAliveUrl} every ${intervalMinutes} minute(s)`);
  setTimeout(ping, 30000);
  setInterval(ping, intervalMs);
}

// ─── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(s => s.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server requests (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

// Global rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Strict limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many messages sent. Try again later.' },
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/profile',   require('./routes/profile'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/blog',      require('./routes/blog'));
app.use('/api/contact',   contactLimiter, require('./routes/contact'));
app.use('/api/upload',    require('./routes/upload'));
app.use('/api/chat',      require('./routes/chatbot'));
app.use('/api/chats',     require('./routes/chats'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/meta',     require('./routes/meta'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404 handler
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── DB + Start ───────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      startKeepAlive();
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
