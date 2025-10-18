/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.aladin.co.kr' },
      { protocol: 'https', hostname: '**.aladinimg.co.kr' }
    ]
  }
};
export default nextConfig;
