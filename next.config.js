/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false, // 'minify' in Next versions < 12.0
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig
