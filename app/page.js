import HomeContent from '@/components/HomeContent'

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

export default function Home() {
  return <HomeContent />
}
