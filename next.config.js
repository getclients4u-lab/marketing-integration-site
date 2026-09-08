/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Consolidate www -> apex (canonical host)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.marketingintegrationllc.com' }],
        destination: 'https://marketingintegrationllc.com/:path*',
        permanent: true,
      },
      // Legacy Squarespace-era URLs -> preserve inbound link equity
      { source: '/digital-marketing.html', destination: '/', permanent: true },
      { source: '/inbound-marketing.html', destination: '/', permanent: true },
      { source: '/past-work.html', destination: '/', permanent: true },
      { source: '/rewards-loyalty.html', destination: '/', permanent: true },
      { source: '/social-media.html', destination: '/', permanent: true },
      { source: '/contact-form.html', destination: '/contact.html', permanent: true },
    ];
  },
};

module.exports = nextConfig;
