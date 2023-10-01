/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client', 'bcrypt'],
  },
};

module.exports = nextConfig;
