import MillionLint from '@million/lint';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false
  },
  images: {
    remotePatterns: [{
      protocol: 'http',
      hostname: '*.*.*.*',
      pathname: '/Items/**'
    }]
  }
};
export default MillionLint.next({
  rsc: true
})(nextConfig);