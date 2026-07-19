import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const siteUrl = 'https://xri.com.bd'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'XR Interactive — Immersive Technology Studio',
    template: '%s | XR Interactive',
  },
  description: 'Bangladesh\'s leading AR, VR, game development, and immersive technology studio. We build interactive experiences that transform brands.',
  keywords: 'AR, VR, game development, immersive technology, Bangladesh, XR Interactive, augmented reality, virtual reality',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'XR Interactive — Immersive Technology Studio',
    description: 'We build interactive experiences that transform brands.',
    url: siteUrl,
    siteName: 'XR Interactive',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'XR Interactive' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XR Interactive — Immersive Technology Studio',
    description: 'We build interactive experiences that transform brands.',
    images: ['/logo.png'],
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XR Interactive',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: 'Bangladesh\'s leading AR, VR, game development, and immersive technology studio.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dhaka',
    addressCountry: 'BD',
  },
  sameAs: [
    'https://www.facebook.com/xrinteractivebd',
    'https://www.linkedin.com/company/xr-interactive',
    'https://www.instagram.com/xr_interactive',
    'https://www.youtube.com/@xrinteractive/videos',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
