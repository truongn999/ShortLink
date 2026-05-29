import React from 'react';
import { Metadata } from 'next';
import LandingPageClient from '@/app/LandingPageClient';

export const metadata: Metadata = {
  title: 'ShortLink - Rút gọn link miễn phí với phân tích chi tiết',
  description: 'Tạo link rút gọn chuyên nghiệp, theo dõi phân tích chi tiết và tối ưu hóa chiến dịch tiếp thị liên kết của bạn với ShortLink. Miễn phí trọn đời, bảo mật cao và thống kê thời gian thực.',
  keywords: ['rút gọn link', 'link rút gọn', 'tiếp thị liên kết', 'theo dõi link', 'phân tích', 'rút gọn link miễn phí', 'slug tùy chỉnh', 'tạo mã qr'],
  authors: [{ name: 'Đội ngũ ShortLink' }],
  openGraph: {
    title: 'ShortLink - Rút gọn link miễn phí cho tiếp thị liên kết',
    description: 'Tối ưu hóa chiến dịch tiếp thị liên kết của bạn với phân tích chi tiết và link rút gọn tùy chỉnh.',
    url: 'https://shortlink.com', // Replace with actual domain
    siteName: 'ShortLink',
    images: [
      {
        url: 'https://shortlink.com/og-image.jpg', // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: 'Xem trước Bảng điều khiển ShortLink',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShortLink - Rút gọn link miễn phí cho tiếp thị liên kết',
    description: 'Tối ưu hóa chiến dịch tiếp thị liên kết của bạn với phân tích chi tiết và link rút gọn tùy chỉnh.',
    images: ['https://shortlink.com/twitter-image.jpg'], // Replace with actual Twitter image URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ShortLink',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Rút gọn link miễn phí với phân tích chi tiết và theo dõi.',
    featureList: 'Rút gọn link, Phân tích, Mã QR, Slug tùy chỉnh',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPageClient />
    </>
  );
}
