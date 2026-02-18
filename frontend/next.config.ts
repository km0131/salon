/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // 恒久的な転送
      },
    ];
  },
};

export default nextConfig;