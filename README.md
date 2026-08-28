# Marketing Integration LLC — AEO/SEO/GEO Optimized Site

Built with the **aeo-seo-geo-optimizer** skill architecture.

## Stack
- Next.js 14 (static pages + serverless API routes)
- GitHub (repo + lead storage via CSV commits)
- Vercel (deployment)

## Features
- **AEO**: FAQPage schema, direct-answer content, featured-snippet formatting
- **GEO**: `llms.txt`, AI-crawler-friendly `robots.txt`, entity authority (LocalBusiness schema), E-E-A-T signals
- **SEO**: unique titles/meta, canonical, OG/Twitter, geo tags, sitemap
- **Lead capture**: `POST /api/contact` → appends row to `data/leads.csv` in this repo (GitHub API commit)
- **Admin dashboard**: `/admin` — password-protected (JWT) lead viewer

## Environment Variables (Vercel)
```
GITHUB_TOKEN=            # repo write access
GITHUB_OWNER=getclients4u-lab
GITHUB_REPO=marketing-integration-site
ADMIN_PASSWORD=          # dashboard login
JWT_SECRET=              # token signing
SITE_URL=                # canonical URL
```

## Local dev
```bash
npm install
GITHUB_TOKEN=xxx ADMIN_PASSWORD=xxx JWT_SECRET=xxx npm run dev
```

## Deploy
```bash
npm run deploy   # or connect repo to Vercel
```
