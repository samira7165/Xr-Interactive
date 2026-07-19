import HomeContent from '@/components/HomeContent'
import { prisma } from '@/lib/prisma'

async function getFeaturedProjects() {
  const featured = await prisma.project.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  if (featured.length >= 6) return featured

  const rest = await prisma.project.findMany({
    where: { featured: false },
    orderBy: { createdAt: 'desc' },
    take: 6 - featured.length,
  })

  return [...featured, ...rest]
}

export const metadata = {
  title: 'XR Interactive — Immersive Technology Studio',
  description: 'Bangladesh\'s leading AR, VR, game development, and immersive technology studio. We build interactive experiences that transform brands.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'XR Interactive — Immersive Technology Studio',
    description: 'We build interactive experiences that transform brands.',
    url: '/',
  },
}

export default async function Home() {
  const projects = await getFeaturedProjects()
  return <HomeContent projects={projects} />
}
