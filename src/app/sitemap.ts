import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://short-link-aff.vercel.app';

  // 1. Static Routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // 2. Fetch blog posts from Supabase dynamically
  try {
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('is_published', true);

    if (posts && posts.length > 0) {
      const dynamicBlogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      return [...staticRoutes, ...dynamicBlogRoutes];
    }
  } catch (error) {
    console.error('Sitemap generator: Failed to fetch posts from Supabase:', error);
  }

  return staticRoutes;
}
