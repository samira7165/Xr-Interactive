import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata = {
  title: 'XR Interactive — Immersive Technology Studio',
  description: 'Bangladesh\'s leading AR, VR, game development, and immersive technology studio. We build interactive experiences that transform brands.',
  keywords: 'AR, VR, game development, immersive technology, Bangladesh, XR Interactive, augmented reality, virtual reality',
  openGraph: {
    title: 'XR Interactive — Immersive Technology Studio',
    description: 'We build interactive experiences that transform brands.',
    url: 'https://xri.com.bd',
    siteName: 'XR Interactive',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
