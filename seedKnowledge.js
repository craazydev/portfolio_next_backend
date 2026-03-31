require('dotenv').config();
const mongoose      = require('mongoose');
const KnowledgeBase = require('./models/KnowledgeBase');

const KNOWLEDGE = [
  {
    category: 'about', order: 1,
    title: 'Who is Ashutosh Dubey',
    content: `Ashutosh Dubey is a Full Stack Developer based in Lucknow, India with 3+ years of professional experience.
He specializes in building scalable web applications, SaaS products, and payment integrations.
He has worked with startups, small businesses, and individual clients across India.
He is available for freelance projects, contract work, and full-time opportunities.`,
  },
  {
    category: 'skills', order: 2,
    title: 'Technical Skills',
    content: `Frontend: React.js, Next.js (14+), TypeScript, Tailwind CSS, HTML5, CSS3, JavaScript ES6+
Backend: Node.js, Express.js, PHP, Laravel basics
Databases: MongoDB, MySQL, Redis
APIs: RESTful APIs, GraphQL, WebSockets
Payment Gateways: Razorpay (expert), PhonePe (expert), Stripe
DevOps: Docker, AWS EC2/S3, Vercel, Railway, Linux CLI, Nginx
Tools: Git, GitHub, VS Code, Postman, Figma`,
  },
  {
    category: 'projects', order: 3,
    title: 'Notable Projects',
    content: `1. Dr. Helper — Healthcare platform for skin disease diagnosis with doctor consultation booking (PHP, MySQL)
2. PhonePe Payment Gateway — Complete integration with HMAC verification and webhooks (PHP)
3. Razorpay Integration — One-time payments, subscriptions, payment links (PHP/Node.js)
4. VCard QR Generator — Digital business card generator used by 1000+ users (PHP)
5. Micasa Interiors — Interior design portfolio with gallery and inquiry system (PHP)
6. School Management System — Student records, fees, attendance, report cards (PHP, MySQL)
7. SMS Gateway Integration — Bulk SMS with OTP delivery and reports
8. Portfolio CMS — Custom content management system for portfolio management`,
  },
  {
    category: 'services', order: 4,
    title: 'Services Offered',
    content: `1. Full Stack Web Development — Complete web applications from design to deployment
2. Payment Gateway Integration — Razorpay, PhonePe, Stripe, PayU integrations
3. API Development — RESTful and GraphQL APIs with authentication and documentation
4. SaaS Development — Multi-tenant applications with subscription management
5. WordPress/PHP Development — Custom themes, plugins, and CMS solutions
6. Database Design — MongoDB, MySQL schema design and optimization
7. Web App Maintenance — Bug fixes, updates, performance optimization`,
  },
  {
    category: 'pricing', order: 5,
    title: 'Pricing & Availability',
    content: `Ashutosh works on both fixed-price and hourly basis depending on the project.
For pricing inquiries, visitors should contact him directly through the contact page.
He typically responds within 24 hours.
He is open to both short-term and long-term projects.
For urgent projects, he can also accommodate tight deadlines.`,
  },
  {
    category: 'contact', order: 6,
    title: 'How to Contact Ashutosh',
    content: `Contact form: Visit /contact on this website
LinkedIn: https://linkedin.com/in/ashutosh-dubey-78111225b/
GitHub: https://github.com/Ashutosh724425
Location: Lucknow, Uttar Pradesh, India
Available for remote work worldwide and local work in Lucknow.
Best way to reach him is through the contact form for project inquiries.`,
  },
  {
    category: 'faq', order: 7,
    title: 'Frequently Asked Questions',
    content: `Q: How long does it take to build a website?
A: Simple websites take 1-2 weeks. Complex web apps with custom features take 4-8 weeks depending on scope.

Q: Do you work with international clients?
A: Yes! Ashutosh works with clients globally and is comfortable with remote collaboration.

Q: Do you provide post-launch support?
A: Yes, he provides 30 days of free bug fixes after project delivery and offers ongoing maintenance packages.

Q: What technologies do you prefer for new projects?
A: For new projects he recommends Next.js + Node.js + MongoDB for maximum performance and scalability.

Q: Can you integrate payment gateways?
A: Yes, payment integration is one of his specialties — Razorpay, PhonePe, and Stripe.

Q: Do you have a portfolio or GitHub?
A: Yes! GitHub: https://github.com/Ashutosh724425 and you can browse projects on this website.`,
  },
  {
    category: 'general', order: 8,
    title: 'Fun Facts & Personal',
    content: `- Ashutosh started coding at age 18 and turned it into a career.
- He is passionate about building products that solve real problems.
- He enjoys learning new technologies and sharing knowledge.
- He has built tools used by thousands of users.
- When not coding, he enjoys exploring new tech trends and contributing to open source.`,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected');
  await KnowledgeBase.deleteMany({});
  for (const k of KNOWLEDGE) {
    await KnowledgeBase.create(k);
    console.log(`   ✓ [${k.category}] ${k.title}`);
  }
  console.log(`\n✅ ${KNOWLEDGE.length} knowledge entries seeded`);
  process.exit(0);
}

seed().catch(err => { console.error(err.message); process.exit(1); });
