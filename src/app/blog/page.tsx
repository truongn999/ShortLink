import React from 'react';
import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog & Thông tin - ShortLink',
  description: 'Khám phá tin tức công nghệ mới nhất, những phát hiện thú vị hàng ngày và hướng dẫn trên Blog ShortLink.',
  openGraph: {
    title: 'Blog & Thông tin - ShortLink',
    description: 'Khám phá tin tức công nghệ mới nhất, những phát hiện thú vị hàng ngày và hướng dẫn trên Blog ShortLink.',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
