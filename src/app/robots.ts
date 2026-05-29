import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/blog', '/blog/'],
      disallow: ['/dashboard', '/analytics', '/links', '/settings', '/login', '/signup'],
    },
    sitemap: 'https://short-link-aff.vercel.app/sitemap.xml',
  };
}
