const router = require('express').Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message)
    return res.status(400).json({ success: false, message: 'Name, email and message are required' });

  try {
    // Save to DB
    const contact = await Contact.create({
      name, email, subject, message,
      ip: req.ip,
    });

    // Send email notification
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to:   process.env.CONTACT_RECEIVER,
      subject: `[Portfolio] ${subject || 'New Message'} from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send auto-reply to sender
    await transporter.sendMail({
      from: `"Ashutosh Dubey" <${process.env.SMTP_USER}>`,
      to:   email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for contacting me! I've received your message and will get back to you within 24-48 hours.</p>
        <p>In the meantime, feel free to check out my work on <a href="https://github.com/Ashutosh724425">GitHub</a>.</p>
        <br/>
        <p>Best regards,<br/><strong>Ashutosh Dubey</strong><br/>Full Stack Developer</p>
      `,
    });

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
});

// GET /api/contact  — admin: list all messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/contact/:id/read  — admin
router.patch('/:id/read', auth, async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
