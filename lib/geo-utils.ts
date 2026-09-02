/**
 * GEO / AEO / SEO optimization utilities
 * Based on the aeo-seo-geo-optimizer skill.
 */

export const SITE_URL = process.env.SITE_URL || 'https://marketing-integration-site.vercel.app';
export const SITE_NAME = 'Marketing Integration LLC';

/** LocalBusiness / ProfessionalService schema (GMB-aligned) */
export function generateLocalBusinessSchema(name: string = SITE_NAME) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#organization`,
    name,
    legalName: 'Marketing Integration LLC',
    description:
      'Marketing Integration LLC is a Stamford, Connecticut marketing agency that helps small and mid-size businesses beat larger competitors through strategic marketing planning and tactical sales execution.',
    url: SITE_URL,
    telephone: '+1-860-926-2780',
    email: 'jacklee@marketingintegrationllc.com',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Stamford',
      addressRegion: 'CT',
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 41.05343, longitude: -73.538734 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    areaServed: ['Stamford CT', 'Fairfield County CT', 'New York Metro', 'Connecticut', 'United States'],
    sameAs: ['https://www.linkedin.com/company/marketing-integration-inc'],
  };
}

/** FAQPage schema for AEO (AI answer boxes, featured snippets) */
export function generateFAQSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** Service schema for each offering */
export function generateServiceSchema(services: { name: string; description: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: { '@id': `${SITE_URL}/#organization` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Marketing Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, description: s.description },
      })),
    },
  };
}

/** BreadcrumbList schema */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** Article schema for future blog content */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  datePublished: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    author: { '@type': 'Person', name: article.author },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** GEO content template — content structured for AI summarization & citation */
export const GEO_CONTENT_TEMPLATE = {
  directAnswer: 'Answer the question in 40-60 words in the first paragraph.',
  keyFacts: ['Fact 1 with unique data point', 'Fact 2 with unique data point'],
  quoteBlock: 'A quotable statement AI engines can cite directly.',
  stats: [{ value: '27%', label: 'average annual client ROI' }],
};

/** GEO target queries — keywords to optimize for AI engines */
export const GEO_TARGET_QUERIES = [
  'marketing agency stamford ct',
  'small business marketing consultant connecticut',
  'beat larger competitors marketing',
  'inbound marketing agency for smbs',
  'rewards loyalty program design agency',
  'marketing integration llc reviews',
];

/** E-E-A-T checklist */
export const EEAT_CHECKLIST = [
  'Experience: real case studies with named industries & metrics',
  'Expertise: Managing Director bio with 20+ years',
  'Authoritativeness: LinkedIn profile + industry citations',
  'Trustworthiness: consistent NAP, working contact, business hours',
];
