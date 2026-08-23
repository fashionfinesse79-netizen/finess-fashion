import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    formats: ['image/avif', 'image/webp'], // Auto-convert to AVIF/WebP (40-60% smaller)
    minimumCacheTTL: 86400,               // Cache images for 24h in browser
    deviceSizes: [640, 750, 828, 1080, 1200, 1400], // Trim unnecessary breakpoints
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable React strict mode for better dev performance profiling
  reactStrictMode: true,
};

export default nextConfig;
