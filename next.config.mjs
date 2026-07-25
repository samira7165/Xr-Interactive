/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16's dev/build lock lives at `${distDir}/lock`, scoped per
  // directory regardless of port — so the API-HTTP test server (see
  // __tests__/api-http/setup/globalSetup.js) needs its own distDir to run
  // alongside a real `next dev` the developer already has open. Unset for
  // everyone else — default '.next' behavior is unchanged.
  distDir: process.env.API_TEST_DIST_DIR || '.next',
  // Default bottom-left position collides with the admin sidebar's collapsed
  // icon rail (its profile card sits in that same corner) — dev-only, never
  // ships to production, but annoying enough locally to just move it.
  devIndicators: {
    position: 'top-right',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xri.com.bd' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
    // Next 16 only serves qualities in this list (default is just [75]) —
    // without 80 here, every quality={80} next/image call gets silently
    // clamped down to 75.
    qualities: [75, 80],
    // On networks that use NAT64/DNS64 (no native IPv4), Vercel Blob's hostname
    // can resolve to a 64:ff9b::/96-prefixed address, which Next 16's SSRF guard
    // (added in v16.0.0) treats as a private IP and blocks. remotePatterns above
    // already restricts fetches to two known hosts, so this is low-risk to relax.
    dangerouslyAllowLocalIP: true,
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
