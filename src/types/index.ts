export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  timezone: string;
  language: string;
  plan_type: 'free' | 'pro' | 'enterprise';
  plan_active_until: string | null;
  links_created: number;
  total_clicks: number;
  is_active: boolean;
  email_verified: boolean;
  role: 'user' | 'admin';
}

export interface Link {
  id: string;
  user_id: string | null;
  original_url: string;
  short_code: string;
  title: string | null;
  description: string | null;
  custom_domain: string | null;
  is_active: boolean;
  password_hash: string | null;
  expiration_date: string | null;
  clicks: number;
  last_clicked_at: string | null;
  created_at: string;
  updated_at: string;
  image?: string | null; // For metadata preview
}

export interface Click {
  id: string;
  link_id: string;
  ip_address: string | null;
  user_agent: string | null;
  referer: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
  created_at: string;
  links?: Link; // Pre-fetched relationship in queries
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  image_url: string | null;
  category: string;
  author_id: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  read_time?: string; // Client calculated field
}
