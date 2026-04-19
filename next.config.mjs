/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'feeds.simplecast.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'honorable-sunrise-0d835db6ec.strapiapp.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'honorable-sunrise-0d835db6ec.media.strapiapp.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'image.simplecastcdn.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.simplecast.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
