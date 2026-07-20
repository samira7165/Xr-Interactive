/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xri.com.bd' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
    // Next 16 only serves qualities in this list (default is just [75]) —
    // without 80 here, every quality={80} next/image call gets silently
    // clamped down to 75.
    qualities: [75, 80],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },
  experimental: {
    // This dev machine has limited free RAM; the default worker-per-few-pages
    // parallelism during `next build` was OOM-crashing one of ~15 spawned
    // workers. Forcing everything onto far fewer workers trades build speed
    // for not crashing.
    staticGenerationMinPagesPerWorker: 50,
  },
};

export default nextConfig;
