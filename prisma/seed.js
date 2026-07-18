// Run with: npx prisma db seed
// (or directly: node --env-file=.env.local prisma/seed.js)
// Safe to re-run: skips a table if it already has rows.

import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '../lib/generated/prisma/index.js'
import { getMariaDbConfig } from '../lib/db-config.js'

const adapter = new PrismaMariaDb(getMariaDbConfig(process.env.DATABASE_URL))
const prisma = new PrismaClient({ adapter })

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const projects = [
  { title: 'VR Cricket Experience', category: 'VR', description: 'An immersive VR cricket simulation built for event activations across Bangladesh.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/G1.png', techStack: ['Unity', 'VR', 'C#'], featured: true },
  { title: 'VR Travel Experience', category: 'VR', description: 'Virtual reality travel experience showcasing destinations in stunning 360°.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/G5.png', techStack: ['Unity', 'VR'], featured: false },
  { title: 'VR Adventure Game', category: 'VR', description: 'Action-packed VR game designed for arcade and event setups.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/G4.png', techStack: ['Unity', 'VR', 'C#'], featured: false },
  { title: 'Branded AR Filter', category: 'AR', description: 'Custom AR face filters for social media brand campaigns.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/AR/5.PNG', techStack: ['Spark AR', 'Lens Studio'], featured: true },
  { title: 'AR Product Visualization', category: 'AR', description: 'Augmented reality product try-on experience for retail brands.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/AR/A5.jpg', techStack: ['ARKit', 'ARCore'], featured: false },
  { title: 'AR Face Effects', category: 'AR', description: 'Interactive face tracking AR effects for brand engagement.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/AR/A6.jpg', techStack: ['Spark AR'], featured: false },
  { title: 'Boi Mela VR Activation', category: 'Event', description: 'Virtual reality experience booth at Ekushey Boi Mela, Dhaka.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/Event/E8.jpg', techStack: ['Unity', 'VR'], featured: false },
  { title: 'VR Distribution Event', category: 'Event', description: 'Large-scale VR activation for a product distribution event.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/Event/E4.jpg', techStack: ['Unity'], featured: false },
  { title: 'Corporate VR Tour', category: 'Event', description: 'Custom VR tour experience for corporate event guests.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/Event/E7.jpg', techStack: ['Unity', 'VR'], featured: false },
  { title: 'Brand Campaign Activation', category: 'Campaign', description: 'Interactive tech-powered brand campaign with AR and VR elements.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/Event/E1.jpg', techStack: ['AR', 'VR'], featured: true },
  { title: 'VR Gaming Zone', category: 'VR', description: 'Multi-station VR gaming setup for entertainment venues.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/G2.png', techStack: ['Unity', 'VR'], featured: false },
  { title: 'Social Media AR Campaign', category: 'AR', description: 'Viral AR filter campaign for Instagram and Facebook.', thumbnail: 'https://xri.com.bd/frontend/images/gallery/AR/A8.jpg', techStack: ['Spark AR'], featured: false },
]

const posts = [
  { title: 'How AR is Transforming Brand Marketing in Bangladesh', excerpt: 'Augmented reality is opening up new possibilities for brands looking to create memorable, interactive campaigns in the Bangladeshi market.', date: 'June 15, 2025', category: 'AR/VR', image: 'https://xri.com.bd/frontend/images/gallery/AR/4.PNG' },
  { title: 'Building VR Experiences for Live Events', excerpt: 'A behind-the-scenes look at how we design and deploy VR gaming zones for large-scale events and activations.', date: 'May 28, 2025', category: 'Events', image: 'https://xri.com.bd/frontend/images/gallery/Event/E2.jpg' },
  { title: 'The Future of WebAR: No App Required', excerpt: 'Web-based augmented reality is making immersive experiences accessible to everyone through just a browser.', date: 'May 10, 2025', category: 'Technology', image: 'https://xri.com.bd/frontend/images/gallery/G8.png' },
  { title: 'Why Brands Need Gamification in 2025', excerpt: 'From playable ads to branded hyper-casual games, gamification is driving deeper engagement and better ROI.', date: 'April 22, 2025', category: 'Gaming', image: 'https://xri.com.bd/frontend/images/gallery/G3.png' },
  { title: 'Our Journey: From Startup to 100+ Projects', excerpt: 'Reflecting on how XR Interactive grew from a small Dhaka startup to delivering over 100 immersive projects.', date: 'April 5, 2025', category: 'Company', image: 'https://xri.com.bd/frontend/images/gallery/Event/E3.jpg' },
  { title: 'AI Meets AR: Generative Filters for Social Media', excerpt: 'Exploring how generative AI is being combined with AR to create one-of-a-kind social media experiences.', date: 'March 18, 2025', category: 'AI', image: 'https://xri.com.bd/frontend/images/gallery/AR/6.PNG' },
]

const team = [
  { name: 'Founder & CEO', role: 'Founder & CEO', bio: 'Leads XRI’s vision and client partnerships since founding the studio in 2012.', image: 'https://xri.com.bd/frontend/images/team/ceo.png' },
  { name: 'Creative Director', role: 'Creative Director', bio: 'Shapes the creative direction across every AR/VR and brand campaign.', image: 'https://xri.com.bd/frontend/images/team/creative-director.png' },
  { name: 'Lead Developer', role: 'Lead Developer', bio: 'Oversees engineering across web, game, and immersive projects.', image: 'https://xri.com.bd/frontend/images/team/lead-developer.png' },
  { name: 'XR Engineer', role: 'XR Engineer', bio: 'Builds AR/VR experiences spanning WebAR, mobile, and headset platforms.', image: 'https://xri.com.bd/frontend/images/team/xr-engineer.png' },
  { name: 'Game Designer', role: 'Game Designer', bio: 'Designs branded games and interactive experiences that drive engagement.', image: 'https://xri.com.bd/frontend/images/team/game-designer.png' },
  { name: 'UI/UX Designer', role: 'UI/UX Designer', bio: 'Crafts the interfaces and user flows behind XRI’s digital products.', image: 'https://xri.com.bd/frontend/images/team/ui-ux-designer.png' },
]

const services = [
  { title: 'AR/VR & Mixed Reality', description: 'Immersive experiences that blur the line between digital and physical worlds.', icon: 'Glasses', tag: 'XR', gradient: 'linear-gradient(135deg, #2D1B69 0%, #1A1035 100%)', features: ['VR Games', 'AR Filters', 'WebAR', '360° Tours'], images: ['/services/arvr/G3.png', '/services/arvr/G4.png', '/services/arvr/G5.png'] },
  { title: 'Game Design & Development', description: 'Engaging games that captivate players and elevate brand experiences.', icon: 'Gamepad2', tag: 'Gaming', gradient: 'linear-gradient(135deg, #1B2969 0%, #0F1A3D 100%)', features: ['Mobile Games', 'Branded Games', 'Hyper-Casual', 'Playable Ads'], images: ['/services/games/game1.jpeg', '/services/games/game2.jpeg', '/services/games/game3.jpeg', '/services/games/game4.jpeg'] },
  { title: 'Event Activation', description: 'Turn events into unforgettable interactive experiences.', icon: 'PartyPopper', tag: 'Events', gradient: 'linear-gradient(135deg, #3D1B69 0%, #251040 100%)', features: ['VR Zones', 'AR Photo Booth', 'Installations', 'Brand Activations'], images: ['/services/events/E3.jpg', '/services/events/E7.jpg', '/services/events/E8.jpg'] },
  { title: 'Web & App Solutions', description: 'Full-stack development for modern, performant digital products.', icon: 'Globe', tag: 'Web', gradient: 'linear-gradient(135deg, #1B4D69 0%, #0F2D3D 100%)', features: ['Web Apps', 'Mobile Apps', 'E-commerce', 'UI/UX Design'], images: null },
  { title: 'AI & Generative Solutions', description: 'AI-powered tools and generative experiences for next-gen campaigns.', icon: 'Sparkles', tag: 'AI', gradient: 'linear-gradient(135deg, #4D1B69 0%, #2D1040 100%)', features: ['Gen AI', 'AI Chatbots', 'AI Filters', 'Automation'], images: null },
  { title: 'IoT Solutions', description: 'Connected devices and smart systems for the physical world.', icon: 'Radio', tag: 'IoT', gradient: 'linear-gradient(135deg, #1B6955 0%, #0F3D30 100%)', features: ['Smart Devices', 'Sensors', 'Monitoring', 'Prototyping'], images: null },
]

const clients = [
  { name: 'Airtel', logo: '/clients/airtel.png' },
  { name: 'bKash', logo: '/clients/bkash.png' },
  { name: 'Robi', logo: '/clients/robi.png' },
  { name: 'Banglalink', logo: '/clients/banglalink.png' },
  { name: 'Huawei', logo: '/clients/huawei.png' },
  { name: 'KFC', logo: '/clients/kfc.png' },
]

async function seedProjects() {
  const count = await prisma.project.count()
  if (count > 0) return console.log(`Skipping projects — already has ${count} rows.`)

  for (const p of projects) {
    await prisma.project.create({ data: { ...p, slug: slugify(p.title) } })
  }
  console.log(`Seeded ${projects.length} projects.`)
}

async function seedPosts() {
  const count = await prisma.post.count()
  if (count > 0) return console.log(`Skipping posts — already has ${count} rows.`)

  for (const b of posts) {
    const { date, ...rest } = b
    await prisma.post.create({
      data: { ...rest, slug: slugify(b.title), body: null, published: true, createdAt: new Date(date) },
    })
  }
  console.log(`Seeded ${posts.length} posts.`)
}

async function seedTeam() {
  const count = await prisma.teamMember.count()
  if (count > 0) return console.log(`Skipping team members — already has ${count} rows.`)

  for (const [i, t] of team.entries()) {
    await prisma.teamMember.create({ data: { ...t, order: i } })
  }
  console.log(`Seeded ${team.length} team members.`)
}

async function seedServices() {
  const count = await prisma.service.count()
  if (count > 0) return console.log(`Skipping services — already has ${count} rows.`)

  for (const [i, s] of services.entries()) {
    await prisma.service.create({ data: { ...s, order: i } })
  }
  console.log(`Seeded ${services.length} services.`)
}

async function seedClients() {
  const count = await prisma.client.count()
  if (count > 0) return console.log(`Skipping clients — already has ${count} rows.`)

  for (const [i, c] of clients.entries()) {
    await prisma.client.create({ data: { ...c, order: i } })
  }
  console.log(`Seeded ${clients.length} clients.`)
}

async function seedAdmin() {
  const count = await prisma.adminUser.count()
  if (count > 0) return console.log(`Skipping admin users — already has ${count} rows.`)

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    return console.log('Skipping admin user — set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local to create the first admin login.')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.adminUser.create({ data: { email, passwordHash } })
  console.log(`Seeded admin user ${email}.`)
}

async function main() {
  await seedProjects()
  await seedPosts()
  await seedTeam()
  await seedServices()
  await seedClients()
  await seedAdmin()
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
