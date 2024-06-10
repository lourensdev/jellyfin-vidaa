/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '*.*.*.*',
        pathname: '/Items/**',
      },
    ],
  },
};

export default nextConfig;
