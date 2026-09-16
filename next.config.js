/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
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
