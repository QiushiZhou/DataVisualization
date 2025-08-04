/** @type {import('next').NextConfig} */
const path = require('path'); // ✅ 添加这一行

const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'}/:path*`,
      },
    ];
  },

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src'); // ✅ 用到了 path
    return config;
  },
};

module.exports = nextConfig;
