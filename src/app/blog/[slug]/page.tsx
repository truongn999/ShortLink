import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Facebook, Linkedin, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PublicLayout from '@/components/layout/PublicLayout';
import PostContent from './PostContent';
import type { Post } from '@/types';

// Fetch post data
async function getPost(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    read_time: Math.ceil((data.content?.length || 0) / 1000) + ' phút đọc'
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Bài viết không tồn tại',
    };
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    alternates: {
      canonical: `https://short-link-aff.vercel.app/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 150),
      images: post.image_url ? [post.image_url] : [],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content.substring(0, 150),
    image: post.image_url ? [post.image_url] : [],
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Admin',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ShortLink',
      logo: {
        '@type': 'ImageObject',
        url: 'https://short-link-aff.vercel.app/favicon.svg',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại Blog
        </Link>

        <header className="mb-10 text-center relative">
          <div className="inline-block px-4 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-full text-xs font-bold tracking-wide uppercase mb-6">
            {post.category || 'Chung'}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400 border-y border-neutral-100 dark:border-neutral-800 py-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-neutral-900 dark:text-white">Admin</span>
            </div>
            <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="w-1 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.read_time}
            </div>
          </div>
        </header>

        <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden mb-12 shadow-2xl">
          <img 
            src={post.image_url || `https://source.unsplash.com/random/1200x800?${post.category}`} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <PostContent content={post.content} />

        <div className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-xl">
            <div className="text-neutral-900 dark:text-white font-bold text-lg">
              Chia sẻ bài viết này
            </div>
            <div className="flex gap-4">
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-blue-400 shadow-sm hover:shadow-md transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-700 dark:hover:text-blue-500 shadow-sm hover:shadow-md transition-all">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-500 shadow-sm hover:shadow-md transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-3 rounded-full bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white shadow-sm hover:shadow-md transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
    </>
  );
}
