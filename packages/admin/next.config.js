// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@pkg/*', '@refinedev/chakra-ui', '@refinedev/inferencer'],
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
