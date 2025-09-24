/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'https',
        hostname: 'cdn.arzdigital.com',
      },
      {
        protocol: 'https',
        hostname: 'static.idpay.ir',
      },
    ],
  },
};

export default nextConfig;
