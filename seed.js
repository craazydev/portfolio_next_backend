/**
 * Seed script — populates MongoDB with Ashutosh's real projects & profile
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Profile  = require('./models/Profile');
const Project  = require('./models/Project');
const Blog     = require('./models/Blog');

const PROJECTS = [
  {
    title:       'Dr. Helper',
    description: 'Healthcare platform for diagnosis of skin diseases with AI-assisted treatment recommendations and doctor consultation booking.',
    longDesc:    'Dr. Helper is a full-stack healthcare platform that allows patients to get preliminary diagnosis for skin diseases. It features a symptom checker, image-based disease detection, doctor consultation booking, and a prescription management system.',
    thumbnail:   '/projects/drhelper.webp',
    tech:        ['PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'jQuery', 'AJAX'],
    category:    'fullstack',
    liveUrl:     'https://drhelper.crazydev.in/',
    featured:    true,
    order:       1,
    published:   true,
  },
  {
    title:       'PhonePe Payment Gateway Integration',
    description: 'Complete PhonePe payment gateway integration with webhook handling, transaction verification, and refund management.',
    longDesc:    'A production-ready PhonePe payment integration for PHP applications. Includes HMAC SHA256 signature verification, webhook processing, transaction status polling, refund initiation, and a detailed transaction log dashboard.',
    thumbnail:   '/projects/phonepay.webp',
    tech:        ['PHP', 'PhonePe API', 'MySQL', 'HMAC SHA256', 'cURL'],
    category:    'backend',
    featured:    true,
    order:       2,
    published:   true,
  },
  {
    title:       'VCard QR Generator',
    description: 'Dynamic vCard generator with QR code export. Supports all contact fields, custom styling, and instant download.',
    longDesc:    'A tool that generates professional digital business cards (vCards) with QR code export. Users can fill in their contact details, choose a design theme, and download their vCard as a QR code image or share a link. Used by 1000+ professionals.',
    thumbnail:   '/projects/vcard.webp',
    tech:        ['PHP', 'QR Code Library', 'CSS3', 'JavaScript'],
    category:    'tool',
    featured:    true,
    order:       3,
    published:   true,
  },
  {
    title:       'Micasa Interiors',
    description: 'Interior design company portfolio website with project gallery, service showcase, and client inquiry system.',
    thumbnail:   '/projects/micasa.webp',
    tech:        ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
    category:    'fullstack',
    featured:    false,
    order:       4,
    published:   true,
  },
  {
    title:       'CrazyDev Portfolio CMS',
    description: 'Custom CMS for managing portfolio content — projects, blog posts, profile data, and contact messages from a single admin panel.',
    longDesc:    'A self-built headless CMS powering crazydev.in. Features include project management, blog writing with SEO fields, resume upload, social link management, and a contact inbox with email notifications.',
    tech:        ['PHP', 'MySQL', 'Bootstrap', 'CKEditor', 'AJAX'],
    category:    'fullstack',
    featured:    false,
    order:       5,
    published:   true,
  },
  {
    title:       'Razorpay Integration Module',
    description: 'Modular Razorpay payment integration supporting one-time payments, subscriptions, and payment link generation.',
    tech:        ['PHP', 'Razorpay API', 'MySQL', 'Webhooks'],
    category:    'backend',
    featured:    false,
    order:       6,
    published:   true,
  },
  {
    title:       'SMS Gateway Integration',
    description: 'Bulk SMS gateway integration with OTP delivery, transactional SMS, and delivery report tracking.',
    tech:        ['PHP', 'SMS API', 'MySQL'],
    category:    'backend',
    featured:    false,
    order:       7,
    published:   true,
  },
  {
    title:       'School Management System',
    description: 'Complete school ERP with student records, fee management, attendance tracking, and report card generation.',
    tech:        ['PHP', 'MySQL', 'Bootstrap', 'jQuery', 'FPDF'],
    category:    'fullstack',
    featured:    false,
    order:       8,
    published:   true,
  },
];

const PROFILE = {
  name:         'Ashutosh Dubey',
  title:        'Full Stack Developer',
  tagline:      'Building Scalable Web Applications — Turning Ideas into Reality',
  bio:          "I'm a Full Stack Developer from Lucknow with 3+ years of experience building performant, scalable web applications. I specialize in creating everything from simple landing pages to complex SaaS platforms, payment gateways, and healthcare systems. I love clean code, great UX, and solving real problems.",
  location:     'Lucknow, Uttar Pradesh, India',
  email:        'ashutosh@crazydev.in',
  yearsExp:     3,
  projectsDone: 25,
  social: {
    github:   'https://github.com/Ashutosh724425',
    linkedin: 'https://linkedin.com/in/ashutosh-dubey-78111225b/',
  },
  skills: [
    {
      category: 'Frontend',
      items: [
        { name: 'React / Next.js',  level: 90 },
        { name: 'TypeScript',       level: 78 },
        { name: 'Tailwind CSS',     level: 88 },
        { name: 'HTML / CSS',       level: 95 },
        { name: 'JavaScript',       level: 90 },
      ],
    },
    {
      category: 'Backend',
      items: [
        { name: 'Node.js / Express', level: 85 },
        { name: 'PHP',               level: 88 },
        { name: 'REST APIs',         level: 90 },
        { name: 'GraphQL',           level: 65 },
      ],
    },
    {
      category: 'Database',
      items: [
        { name: 'MongoDB',  level: 80 },
        { name: 'MySQL',    level: 85 },
        { name: 'Redis',    level: 55 },
      ],
    },
    {
      category: 'DevOps & Tools',
      items: [
        { name: 'Git / GitHub', level: 88 },
        { name: 'Docker',       level: 65 },
        { name: 'AWS EC2/S3',   level: 60 },
        { name: 'Vercel',       level: 85 },
        { name: 'Linux CLI',    level: 75 },
      ],
    },
    {
      category: 'Payments',
      items: [
        { name: 'Razorpay',  level: 92 },
        { name: 'PhonePe',   level: 90 },
        { name: 'Stripe',    level: 75 },
      ],
    },
  ],
  services: [
    { icon: '⚡', title: 'Full Stack Development',  description: 'End-to-end web apps with React, Next.js, Node.js & MongoDB.' },
    { icon: '💳', title: 'Payment Integrations',    description: 'Razorpay, PhonePe, Stripe — secure & PCI-compliant flows.' },
    { icon: '🔧', title: 'API Development',          description: 'RESTful & GraphQL APIs with JWT auth and rate limiting.' },
    { icon: '🚀', title: 'SaaS Products',            description: 'Multi-tenant architecture, subscriptions, and dashboards.' },
  ],
};

const SAMPLE_BLOG = {
  title:     'How I Integrated PhonePe Payment Gateway in PHP',
  excerpt:   'A step-by-step guide to integrating the PhonePe payment gateway in PHP, covering HMAC signature generation, webhook handling, and transaction verification.',
  content:   '<h2>Introduction</h2><p>PhonePe is one of India\'s most widely used payment platforms. In this guide, I\'ll walk through the complete integration process in PHP.</p><h2>Prerequisites</h2><ul><li>PhonePe merchant account</li><li>PHP 7.4+</li><li>cURL enabled</li></ul><h2>Step 1: Generate the Signature</h2><p>PhonePe requires HMAC SHA256 signatures for all API requests...</p><p><em>Full article coming soon — check back!</em></p>',
  tags:      ['PHP', 'PhonePe', 'Payment Gateway', 'Tutorial'],
  category:  'Tutorial',
  published: true,
  featured:  true,
};

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected\n');

  // Profile
  await Profile.deleteMany({});
  await Profile.create(PROFILE);
  console.log('✅ Profile seeded');

  // Projects
  await Project.deleteMany({});
  for (const p of PROJECTS) {
    await Project.create(p);
    console.log(`   ✓ ${p.title}`);
  }
  console.log(`✅ ${PROJECTS.length} projects seeded`);

  // Sample blog post
  const existingBlog = await Blog.findOne({ slug: 'how-i-integrated-phonepay-payment-gateway-in-php' });
  if (!existingBlog) {
    await Blog.create(SAMPLE_BLOG);
    console.log('✅ Sample blog post seeded');
  }

  console.log('\n🎉 Seed complete! Visit http://localhost:3000');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err.message); process.exit(1); });
