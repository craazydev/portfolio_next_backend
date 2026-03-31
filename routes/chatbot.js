const router      = require('express').Router();
const OpenAI      = require('openai');
const ChatSession = require('../models/ChatSession');
const KnowledgeBase = require('../models/KnowledgeBase');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Build system prompt ────────────────────────────────────────────────────
async function buildSystemPrompt() {
  const entries = await KnowledgeBase.find({ active: true }).sort({ order: 1 });

  const knowledgeBlock = entries.length
    ? entries.map(e => `[${e.category.toUpperCase()}] ${e.title}:\n${e.content}`).join('\n\n')
    : '';

  return `You are the personal AI assistant for Ashutosh Dubey's portfolio website (crazydev.in).
Your job is to help visitors learn about Ashutosh, his skills, projects, services, and how to hire him.

PERSONALITY:
- Friendly, professional, and concise
- Speak in first-person as "Ashutosh's assistant"
- Be enthusiastic about his work
- Always encourage visitors to reach out via the contact page if they want to hire him
- Never make up information not in the knowledge base
- If you don't know something, say: "I don't have that info right now — feel free to contact Ashutosh directly!"

ABOUT ASHUTOSH DUBEY:
- Full Stack Developer from Lucknow, India
- 3+ years of experience
- Specializes in React, Next.js, Node.js, MongoDB, PHP, MySQL
- Expert in payment integrations: Razorpay, PhonePe, Stripe
- Available for freelance projects and full-time opportunities
- GitHub: https://github.com/Ashutosh724425
- LinkedIn: https://linkedin.com/in/ashutosh-dubey-78111225b/
- Contact page: /contact

${knowledgeBlock ? `KNOWLEDGE BASE:\n${knowledgeBlock}` : ''}

Keep responses short and to the point (2-4 sentences max unless user asks for detail).
Use bullet points when listing multiple items.
End responses with a helpful follow-up suggestion when relevant.`;
}

// ─── POST /api/chat ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message?.trim() || !sessionId) {
    return res.status(400).json({ success: false, message: 'message and sessionId are required' });
  }

  try {
    // Load or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({
        sessionId,
        ip:        req.ip,
        userAgent: req.headers['user-agent'],
      });
    }

    // Add user message to history
    session.messages.push({ role: 'user', content: message.trim() });

    // Build OpenAI messages array from history (last 20 messages for context)
    const history = session.messages.slice(-20).map(m => ({
      role:    m.role,
      content: m.content,
    }));

    const systemPrompt = await buildSystemPrompt();

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model:       process.env.OPENAI_MODEL || 'gpt-4.1-nano',
      messages:    [{ role: 'system', content: systemPrompt }, ...history],
      max_tokens:  300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content.trim();

    // Save assistant reply
    session.messages.push({ role: 'assistant', content: reply });
    session.read = false; // Mark as unread for admin
    await session.save();

    res.json({
      success: true,
      reply,
      sessionId,
      messageCount: session.messageCount,
    });
  } catch (err) {
    console.error('Chatbot error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Assistant is unavailable right now. Please try again.',
    });
  }
});

// ─── GET /api/chat/session/:sessionId ── load chat history (for widget restore)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.json({ success: true, messages: [] });
    res.json({ success: true, messages: session.messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
