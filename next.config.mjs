/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'xri.com.bd' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
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
