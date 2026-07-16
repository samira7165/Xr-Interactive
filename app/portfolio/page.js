import PortfolioGrid from '@/components/PortfolioGrid'

export const metadata = {
  title: 'Portfolio',
  description: 'Browse our AR, VR, event, and campaign work — from VR cricket experiences to branded AR filters, delivered for leading Bangladeshi and global brands.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Portfolio | XR Interactive',
    description: 'Browse our AR, VR, event, and campaign work — from VR cricket experiences to branded AR filters, delivered for leading Bangladeshi and global brands.',
    url: '/portfolio',
  },
}

export default function Portfolio() {
  return (
    <main>
      <div className="page-header">
        <div className="section-label">Portfolio</div>
        <h1>Our <span className="gradient-text">Work</span></h1>
        <p>Explore the immersive experiences {"we have"} built for brands, events, and campaigns.</p>
      </div>

      <section className="section" style={{ paddingTop: '1rem' }}>
        <PortfolioGrid />
      </section>
    </main>
  )
}
