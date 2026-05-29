import React from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import type { Link } from '@/types';
import RedirectClient from './RedirectClient';

type Props = {
  params: Promise<{ shortCode: string }>;
};

// Fetch link data helper
async function getLink(shortCode: string): Promise<Link | null> {
  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('short_code', shortCode)
    .single();
  return link;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortCode } = await params;
  const link = await getLink(shortCode);

  if (!link) {
    return {
      title: 'Link Not Found - ShortLink',
      description: 'The requested short link could not be found.',
    };
  }

  return {
    title: link.title || 'Redirecting... - ShortLink',
    description: link.description || `Redirecting to ${link.original_url}`,
    openGraph: {
      title: link.title || 'Shared Link - ShortLink',
      description: link.description || `Click to visit ${link.original_url}`,
      url: `https://shortlink.com/${shortCode}`,
      images: link.image ? [{ url: link.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: link.title || 'Shared Link - ShortLink',
      description: link.description || `Click to visit ${link.original_url}`,
      images: link.image ? [link.image] : [],
    },
  };
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params;
  const link = await getLink(shortCode);

  return <RedirectClient shortCode={shortCode} initialLink={link || undefined} />;
}
